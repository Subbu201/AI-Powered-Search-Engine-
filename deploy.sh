#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==========================================="
echo " Deploying Code Search Platform to Docker  "
echo "==========================================="

# Check if .env file exists, otherwise warn the user
if [ ! -f .env ]; then
    echo "WARNING: .env file not found in the current directory."
    echo "Please ensure you have configured DB_USERNAME, DB_PASSWORD, JWT_SECRET, and GEMINI_API_KEY."
    echo "Continuing deployment..."
fi

echo "[1/3] Building and starting Docker containers..."
docker compose up --build -d

echo "[2/3] Checking container status..."
docker ps

echo "[3/3] Deployment complete!"
echo ""
echo "Application should now be accessible at:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo ""
echo "To view live logs, run: docker compose logs -f"
echo "==========================================="
