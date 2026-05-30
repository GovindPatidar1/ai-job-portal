# 🤖 AI-Powered Job Portal (MERN Stack)

A full-stack MERN application with AI features powered by Google Gemini API.

## ✨ Features
- JWT Auth + Google OAuth
- Resume Upload & AI Parsing
- AI Job Recommendations
- AI Cover Letter Generator
- Skill Gap Analysis
- AI Chatbot
- Admin Dashboard
- Swagger API Docs

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **AI:** Google Gemini API
- **Storage:** Cloudinary
- **Auth:** JWT + Google OAuth

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-job-portal.git
cd ai-job-portal
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## 🔑 Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📖 API Docs
Visit `http://localhost:5000/api-docs` after starting the server.
