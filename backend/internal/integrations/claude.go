// backend/internal/integrations/claude.go
package integrations

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "strings"  // ← Add this import
    "calhacks/internal/models"
)

type ClaudeClient struct {
    apiKey  string
    baseURL string
}

func NewClaudeClient() *ClaudeClient {
    return &ClaudeClient{
        apiKey:  os.Getenv("CLAUDE_API_KEY"),
        baseURL: "https://api.anthropic.com/v1/messages",
    }
}

// Generate a persona based on user settings
func (c *ClaudeClient) GeneratePersona(req models.PersonaGenerationRequest) (*models.Persona, error) {
    // Build the prompt for Claude
    prompt := c.buildPersonaPrompt(req)

    // Make API request to Claude
    claudeReq := models.ClaudeRequest{
        Model:     "claude-sonnet-4-20250514",
        MaxTokens: 1024,
        Messages: []models.ClaudeMessage{
            {
                Role:    "user",
                Content: prompt,
            },
        },
    }

    // Convert to JSON
    jsonData, err := json.Marshal(claudeReq)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request: %w", err)
    }

    // Create HTTP request
    httpReq, err := http.NewRequest("POST", c.baseURL, bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    // Set headers
    httpReq.Header.Set("Content-Type", "application/json")
    httpReq.Header.Set("x-api-key", c.apiKey)
    httpReq.Header.Set("anthropic-version", "2023-06-01")

    // Send request
    client := &http.Client{}
    resp, err := client.Do(httpReq)
    if err != nil {
        return nil, fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    // Read response
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("failed to read response: %w", err)
    }

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
    }

    // Parse response
    var claudeResp models.ClaudeResponse
    if err := json.Unmarshal(body, &claudeResp); err != nil {
        return nil, fmt.Errorf("failed to unmarshal response: %w", err)
    }

    if len(claudeResp.Content) == 0 {
        return nil, fmt.Errorf("no content in Claude response")
    }

    // Parse the persona from Claude's response (it returns JSON)
    persona, err := c.parsePersonaFromResponse(claudeResp.Content[0].Text, req)
    if err != nil {
        return nil, fmt.Errorf("failed to parse persona: %w", err)
    }

    return persona, nil
}

// Build the prompt for Claude to generate a persona
func (c *ClaudeClient) buildPersonaPrompt(req models.PersonaGenerationRequest) string {
    // Base prompt
    basePrompt := fmt.Sprintf(`You are an AI that generates realistic sales prospect personas for practice calls.

Generate a detailed persona, for now only with female names, based on these parameters:
- Role: %s
- Company: %s
- Difficulty: %s (easy = friendly/interested, medium = skeptical but open, harsh = hostile/dismissive)
- Call Type: %s`,
        req.ProspectRole,
        req.CompanyName,
        req.Difficulty,
        req.CallType,
    )

    // Add user notes if provided
    if req.Notes != "" {
        basePrompt += fmt.Sprintf(`

IMPORTANT USER GUIDELINES:
The user has provided these specific notes and guidelines for this practice session:
%s

Make sure the persona and their objections align with these guidelines. The prospect should bring up topics related to these notes during the conversation.`,
            req.Notes,
        )
    }

    // Continue with the rest of the prompt
    basePrompt += fmt.Sprintf(`

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "name": "Full Name",
  "role": "%s",
  "company": "%s",
  "personality": "brief personality description",
  "communicationStyle": "formal/casual/direct/etc",
  "currentSituation": "their current business context and pain points",
  "objections": ["objection 1", "objection 2", "objection 3"],
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "confidenceScore": 0.85
}

Make the persona realistic and appropriate for the difficulty level. For harsh difficulty, make them dismissive and challenging. For easy, make them curious and open.`,
        req.ProspectRole,
        req.CompanyName,
    )

    return basePrompt
}

// Parse Claude's JSON response into a Persona struct
func (c *ClaudeClient) parsePersonaFromResponse(text string, req models.PersonaGenerationRequest) (*models.Persona, error) {
    var persona models.Persona

    // Claude should return pure JSON, but sometimes wraps it in markdown
    // Clean it up if needed
    text = c.cleanJSONResponse(text)

    if err := json.Unmarshal([]byte(text), &persona); err != nil {
        return nil, fmt.Errorf("failed to parse JSON: %w", err)
    }

    // Set difficulty from request
    persona.Difficulty = req.Difficulty

    return &persona, nil
}

// Clean JSON response (remove markdown code blocks if present)
func (c *ClaudeClient) cleanJSONResponse(text string) string {
    // Remove ```json and ``` if present using strings package
    text = strings.TrimPrefix(text, "```json\n")
    text = strings.TrimPrefix(text, "```json")
    text = strings.TrimPrefix(text, "```\n")
    text = strings.TrimPrefix(text, "```")
    text = strings.TrimSuffix(text, "\n```")
    text = strings.TrimSuffix(text, "```")
    text = strings.TrimSpace(text)
    
    return text
}