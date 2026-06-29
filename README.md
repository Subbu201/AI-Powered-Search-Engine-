# AI-Powered Code Search & Repository Analytics Platform

## Local Docker Deployment

This guide provides step-by-step instructions for deploying the platform locally using Docker.

### Prerequisites
- Docker installed on your machine
- Docker Compose installed

### Configuration
Create a `.env` file in the root of the repository:
```bash
DB_USERNAME=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### Deployment Commands

We provide a convenient script (`deploy.sh`) to automate this, or you can run the commands manually:

* **Build and Start Containers**:
  ```bash
  chmod +x deploy.sh
  ./deploy.sh
  ```
  *Alternatively, manually run:* `docker compose up --build -d`

* **Check Container Status**:
  ```bash
  docker ps
  ```

* **View Logs**:
  ```bash
  docker compose logs -f
  ```

### Access Application

Once the containers are running, you can access your application locally at:

* **Frontend**: `http://localhost:3000`
* **Backend**: `http://localhost:8080`
