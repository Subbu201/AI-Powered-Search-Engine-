# 🤖 AI-Powered Code Search Engine

An AI-powered full-stack web application that enables developers to search code repositories, understand code with AI-generated explanations, and manage indexed repositories efficiently.

## 🚀 Live Demo

Frontend: https://ai-powered-search-engine-2.onrender.com

Backend API: https://ai-powered-search-engine-1-e8vr.onrender.com

## ✨ Features

- 🔐 JWT-based User Authentication
- 👤 User Registration & Login
- 📂 Repository Indexing
- 🔍 Fast Code Search
- 🤖 AI-Powered Code Explanation using Google Gemini
- 📊 Search Analytics Dashboard
- ☁️ MongoDB Atlas Integration
- 🌐 RESTful APIs
- 🐳 Docker Support
- 🚀 Deployed on Render

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Java
- Spring Boot 3
- Spring Security
- JWT Authentication
- Maven

### Database
- MongoDB Atlas

### AI
- Google Gemini API

### Deployment
- Docker
- Render

## 📌 Project Architecture

```
React + Vite
      │
      ▼
Spring Boot REST API
      │
      ├── MongoDB Atlas
      │
      └── Google Gemini API
```

## 📷 Screenshots

> Add screenshots of:
- Login Page
- Registration Page
- Dashboard
- Search Results
- AI Explanation

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Subbu201/AI-Powered-Search-Engine-.git
```

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend

```properties
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend

```env
VITE_API_BASE_URL=https://ai-powered-search-engine-1-e8vr.onrender.com
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register User |
| POST | /login | User Login |
| GET | /repositories | Get Repositories |
| POST | /repositories | Add Repository |
| GET | /search | Search Code |
| POST | /ai/explain | Generate AI Explanation |

## 🎯 Future Enhancements

- GitHub OAuth Login
- Repository Synchronization
- Semantic Vector Search
- Multi-language Code Analysis
- Dark Mode
- Code Complexity Analysis

## 👨‍💻 Author

**Subbu**

LinkedIn: *(Add your LinkedIn profile)*

GitHub: https://github.com/Subbu201

---

⭐ If you found this project helpful, consider giving it a Star!
