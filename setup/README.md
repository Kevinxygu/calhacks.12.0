# Getting started — root folder

Prerequisites
- Docker (and Docker Compose / Docker Desktop) installed
- (Optional) git if you need to clone the repo

Quick start (from project root)
1. Open a terminal and go to project root:

2. Build and run frontend + backend with Docker Compose:
    ```bash
    docker-compose up --build
    ```
    - To run detached:
      ```bash
      docker-compose up --build -d
      ```

How to access services
- Frontend (nextJS + TypeScript): http://localhost:3000
- Backend (Go): http://localhost:8080

Common commands
- View logs:
  ```bash
  docker-compose logs -f
  ```
- Stop and remove containers:
  ```bash
  docker-compose down
  ```
- Rebuild without cache:
  ```bash
  docker-compose build --no-cache
  docker-compose up --build
  ```

Notes / troubleshooting
- If ports 3000 or 8080 are in use, stop the conflicting service or change ports in docker-compose.yml.
- If using Docker Compose v2, you may need `docker compose` (space) instead of `docker-compose`.
- If images fail on Apple Silicon, try adding `platform: linux/amd64` to the relevant service in docker-compose.yml.

Optional: run services locally (without Docker)
- Frontend (if you want local dev):
  ```bash
  cd frontend
  pnpm install
  pnpm dev
  ```
- Backend (Go):
  ```bash
  cd backend > cmd > server > go run main.go
  ```

This should get the project up and running from the root folder. Adjust docker-compose.yml or environment files as needed.