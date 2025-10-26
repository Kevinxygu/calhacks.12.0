// backend/internal/services/persona_service.go
package services

import (
    "log"
    "calhacks/internal/integrations"
    "calhacks/internal/models"
)

type PersonaService struct {
    claudeClient      *integrations.ClaudeClient
    elevenLabsClient  *integrations.ElevenLabsClient
}

func NewPersonaService() *PersonaService {
    return &PersonaService{
        claudeClient:     integrations.NewClaudeClient(),
        elevenLabsClient: integrations.NewElevenLabsClient(),
    }
}

// Generate complete persona with greeting audio
func (s *PersonaService) GeneratePersona(req models.PersonaGenerationRequest) (*models.PersonaGenerationResponse, error) {
    log.Printf("Generating persona for %s at %s (difficulty: %s)", req.ProspectRole, req.CompanyName, req.Difficulty)

    // Step 1: Generate persona using Claude
    persona, err := s.claudeClient.GeneratePersona(req)
    if err != nil {
        return nil, err
    }

    log.Printf("Generated persona: %s (%s)", persona.Name, persona.Role)

    // Step 2: Generate greeting audio using ElevenLabs
    greetingAudio, err := s.elevenLabsClient.GenerateGreeting(persona)
    if err != nil {
        log.Printf("Warning: Failed to generate audio: %v", err)
        // Continue without audio - don't fail the entire request
        greetingAudio = ""
    }

    log.Printf("Generated greeting audio (length: %d bytes)", len(greetingAudio))

    // Return response
    return &models.PersonaGenerationResponse{
        Persona:       *persona,
        GreetingAudio: greetingAudio,
        Status:        "success",
    }, nil
}