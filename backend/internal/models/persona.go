package models

// Request from frontend
type PersonaGenerationRequest struct {
    Difficulty    string `json:"difficulty"`    // easy, medium, harsh
    ProspectRole  string `json:"prospectRole"`  // VP of Engineering, etc
    CompanyName   string `json:"companyName"`   // Acme Corp
    CallType      string `json:"callType"`      // cold, follow-up, closing
    EnableCoaching bool  `json:"enableCoaching"`
}

// Response to frontend
type PersonaGenerationResponse struct {
    Persona    Persona `json:"persona"`
    GreetingAudio string `json:"greetingAudio"` // Base64 encoded audio or URL
    Status     string  `json:"status"`          // "success" or "error"
}

// Full Persona structure
type Persona struct {
    Name               string   `json:"name"`
    Role               string   `json:"role"`
    Company            string   `json:"company"`
    Personality        string   `json:"personality"`
    CommunicationStyle string   `json:"communicationStyle"`
    CurrentSituation   string   `json:"currentSituation"`
    Objections         []string `json:"objections"`
    Difficulty         string   `json:"difficulty"`
    VoiceID            string   `json:"voiceId"`
    ConfidenceScore    float64  `json:"confidenceScore"`
}

// Claude API structures
type ClaudeRequest struct {
    Model     string          `json:"model"`
    MaxTokens int             `json:"max_tokens"`
    Messages  []ClaudeMessage `json:"messages"`
}

type ClaudeMessage struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type ClaudeResponse struct {
    Content []struct {
        Text string `json:"text"`
    } `json:"content"`
}

// ElevenLabs API structures
type ElevenLabsRequest struct {
    Text          string                   `json:"text"`
    ModelID       string                   `json:"model_id"`
    VoiceSettings ElevenLabsVoiceSettings `json:"voice_settings"`
}

type ElevenLabsVoiceSettings struct {
    Stability       float64 `json:"stability"`
    SimilarityBoost float64 `json:"similarity_boost"`
}