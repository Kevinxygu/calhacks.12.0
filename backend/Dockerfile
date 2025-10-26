# Use official Go image
FROM golang:1.23-alpine

# Install Air for hot reloading (like nodemon for Node.js)
# Air watches Go files and rebuilds automatically when you save
RUN go install github.com/air-verse/air@v1.52.3

# Set working directory inside container
WORKDIR /app

# Copy go.mod and go.sum first (for better caching)
# Docker caches layers, so if these don't change, dependencies won't reinstall
COPY go.mod go.sum ./

# Download dependencies
# This layer is cached unless go.mod/go.sum change
RUN go mod download

# Copy the rest of the source code
# This happens after dependencies so changes to code don't require re-downloading deps
COPY . .

# Expose port 8080 (document what port the app uses)
EXPOSE 8080

# Run Air (hot reload server)
# Air will watch for file changes and rebuild automatically
CMD ["air", "-c", ".air.toml"]