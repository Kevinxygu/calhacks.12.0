// backend/internal/handlers/persona.go
package handlers

import (
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
    "calhacks/internal/models"
    "calhacks/internal/services"
)

type PersonaHandler struct {
    service *services.PersonaService
}

func NewPersonaHandler() *PersonaHandler {
    return &PersonaHandler{
        service: services.NewPersonaService(),
    }
}

// POST /api/persona/generate
func (h *PersonaHandler) GeneratePersona(c *gin.Context) {
    var req models.PersonaGenerationRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "status": "error",
            "error":  "Invalid request body: " + err.Error(),
        })
        return
    }

    if req.ProspectRole == "" || req.CompanyName == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "status": "error",
            "error":  "prospectRole and companyName are required",
        })
        return
    }

    log.Printf("Received persona generation request: %+v", req)

    response, err := h.service.GeneratePersona(req)
    if err != nil {
        log.Printf("Error generating persona: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{
            "status": "error",
            "error":  "Failed to generate persona: " + err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, response)
}