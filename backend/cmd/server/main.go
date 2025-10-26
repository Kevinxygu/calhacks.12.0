package main

// imports
import (
	"log"
	"net/http"
	"time"
	"github.com/gin-gonic/gin" // gin for HTTP
)

// main function, for now just health check
func main() {
	// create web server
	router := gin.Default()

	// health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Server is running",
			"time":    time.Now().Format(time.RFC3339),
			"service": "Calhacks 12.0 Backend",
		})
	})

	// root endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to the Calhacks 12.0 Backend!",
			"docs": "Visit /health for the health check",
		})
	})

	// start server
	port := "8080"
	log.Printf("Starting server on port %s...", port)
	log.Printf("Health check at http://localhost:%s/health", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}