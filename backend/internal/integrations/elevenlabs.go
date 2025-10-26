// backend/internal/integrations/elevenlabs.go
package integrations

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "calhacks/internal/models"
)

type ElevenLabsClient struct {
    apiKey  string
    baseURL string
}

func NewElevenLabsClient() *ElevenLabsClient {
    return &ElevenLabsClient{
        apiKey:  os.Getenv("ELEVENLABS_API_KEY"),
        baseURL: "https://api.elevenlabs.io/v1",
    }
}

// Generate audio greeting from persona
func (e *ElevenLabsClient) GenerateGreeting(persona *models.Persona) (string, error) {
    // Create greeting text based on persona
    greetingText := e.buildGreetingText(persona)

    // Generate audio using ElevenLabs
    audioData, err := e.textToSpeech(greetingText, persona.VoiceID)
    if err != nil {
        return "", err
    }

    // Convert to base64 (for embedding in JSON response)
    // Alternative: Save to file/S3 and return URL
    base64Audio := base64.StdEncoding.EncodeToString(audioData)
    
    // Return as data URI
    return fmt.Sprintf("data:audio/mpeg;base64,%s", base64Audio), nil
}

// Build greeting text based on persona
func (e *ElevenLabsClient) buildGreetingText(persona *models.Persona) string {
    greetings := map[string]string{
        "easy": fmt.Sprintf("Hi there! This is %s, %s at %s. Thanks for reaching out - I've been looking for solutions like yours. How can I help you today?",
            persona.Name, persona.Role, persona.Company),
        "medium": fmt.Sprintf("Hello, %s speaking. I'm the %s at %s. I have a few minutes - what's this about?",
            persona.Name, persona.Role, persona.Company),
        "harsh": fmt.Sprintf("Yeah, this is %s. Look, I'm busy - we're not interested in new vendors right now. What do you want?",
            persona.Name),
    }

    greeting, exists := greetings[persona.Difficulty]
    if !exists {
        greeting = greetings["medium"]
    }

    return greeting
}

// Generate speech from text using ElevenLabs API
func (e *ElevenLabsClient) textToSpeech(text string, voiceID string) ([]byte, error) {
    // Build request
    reqBody := models.ElevenLabsRequest{
        Text:    text,
        ModelID: "eleven_monolingual_v1",
        VoiceSettings: models.ElevenLabsVoiceSettings{
            Stability:       0.5,
            SimilarityBoost: 0.75,
        },
    }

    jsonData, err := json.Marshal(reqBody)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request: %w", err)
    }

    // Create HTTP request
    url := fmt.Sprintf("%s/text-to-speech/%s", e.baseURL, voiceID)
    httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    // Set headers
    httpReq.Header.Set("Content-Type", "application/json")
    httpReq.Header.Set("xi-api-key", e.apiKey)

    // Send request
    client := &http.Client{}
    resp, err := client.Do(httpReq)
    if err != nil {
        return nil, fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    // Read response
    audioData, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("failed to read response: %w", err)
    }

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(audioData))
    }

    return audioData, nil
}