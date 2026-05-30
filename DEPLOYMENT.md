# 🚀 Complete Setup & Deployment Guide

## ─────────────────────────────────────────
## STEP 1 — Get Your API Keys (Free)
## ─────────────────────────────────────────

### MongoDB Atlas (Database) — FREE
1. Go to https://cloud.mongodb.com
2. Create a free account
3. Click "Build a Database" → choose FREE (M0 Sandbox)
4. Username: your_username | Password: your_password
5. Click "Connect" → "Connect your application"
6. Copy the URI (looks like): mongodb+srv://user:pass@cluster.mongodb.net/aijobportal
mongodb+srv://govindsangoi123_db_user:govind@123@cluster0.ba6x3vj.mongodb.net/
7. Paste it as MONGO_URI in server/.env

### Google Gemini API — FREE
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click "Get API Key" → "Create API key"
4. Copy the key → paste as GEMINI_API_KEY in server/.env

### Cloudinary (File Storage) — FREE
1. Go to https://cloudinary.com → Sign up free
2. Dashboard shows: Cloud Name, API Key, API Secret
3. Copy all three → paste in server/.env

### Google OAuth (Sign in with Google) — FREE
1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to "APIs & Services" → "OAuth consent screen" → External → Fill app name
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Application type: Web application
6. Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
7. Copy Client ID and Client Secret → paste in server/.env

## ─────────────────────────────────────────
## STEP 2 — Run Locally in VS Code
## ─────────────────────────────────────────

```bash
# Clone or open the folder in VS Code
cd ai-job-portal

# Install backend dependencies
cd server
npm install

# Copy env file and fill in your keys
cp .env.example .env
# Now open server/.env and fill ALL values

# Start backend (Terminal 1)
npm run dev

# In a NEW terminal (Terminal 2):
cd client
npm install
cp .env.example .env
# client/.env should have: VITE_API_URL=http://localhost:5000/api

npm run dev
```

Open browser: http://localhost:5173 ✅

## ─────────────────────────────────────────
## STEP 3 — Push to GitHub
## ─────────────────────────────────────────

```bash
# From the root ai-job-portal folder:
git init
git add .
git commit -m "Initial commit: AI Job Portal MERN"

# Create a repo on github.com (name: ai-job-portal)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/ai-job-portal.git
git branch -M main
git push -u origin main
```

⚠️ The .gitignore already excludes .env and node_modules — your secrets are safe!

## ─────────────────────────────────────────
## STEP 4 — Deploy Backend to Render (Free)
## ─────────────────────────────────────────

1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Name: ai-job-portal-backend
   - Root Directory: server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
5. Click "Add Environment Variable" and add ALL your .env values:
   - PORT = 5000
   - MONGO_URI = (your atlas uri)
   - JWT_SECRET = (any long random string)
   - GEMINI_API_KEY = (your gemini key)
   - CLOUDINARY_CLOUD_NAME = (your cloudinary name)
   - CLOUDINARY_API_KEY = (your cloudinary key)
   - CLOUDINARY_API_SECRET = (your cloudinary secret)
   - GOOGLE_CLIENT_ID = (your google client id)
   - GOOGLE_CLIENT_SECRET = (your google secret)
   - GOOGLE_CALLBACK_URL = https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback
   - CLIENT_URL = https://YOUR-VERCEL-URL.vercel.app
6. Click "Create Web Service"
7. Wait 3-5 minutes → copy your Render URL (e.g. https://ai-job-portal-abc.onrender.com)

## ─────────────────────────────────────────
## STEP 5 — Deploy Frontend to Vercel (Free)
## ─────────────────────────────────────────

1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New Project" → Import your GitHub repo
3. Settings:
   - Framework: Vite
   - Root Directory: client
4. Add Environment Variable:
   - VITE_API_URL = https://YOUR-RENDER-URL.onrender.com/api
5. Click "Deploy"
6. Wait 1-2 minutes → your app is live! 🎉

## ─────────────────────────────────────────
## STEP 6 — Final Fixes After Deploy
## ─────────────────────────────────────────

After both are deployed:

1. Update Render env var:
   CLIENT_URL = https://YOUR-VERCEL-URL.vercel.app

2. Update Google Console:
   Authorized redirect URIs → add:
   https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback

3. Test all features:
   ✅ Register / Login
   ✅ Google OAuth
   ✅ Browse Jobs
   ✅ Post a Job (as employer)
   ✅ Upload Resume
   ✅ AI Cover Letter
   ✅ Skill Gap Analysis
   ✅ AI Chatbot
   ✅ Admin Panel (register with role:admin manually in MongoDB)
   ✅ API Docs at /api-docs

## ─────────────────────────────────────────
## HOW TO CREATE ADMIN USER
## ─────────────────────────────────────────

1. Register normally on the site
2. Go to MongoDB Atlas → Browse Collections → users
3. Find your user → Edit → change role from "jobseeker" to "admin"
4. Save → Log out and log back in → Admin tab appears in Navbar

## ─────────────────────────────────────────
## API ENDPOINTS REFERENCE
## ─────────────────────────────────────────

Auth:
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/me
  PUT  /api/auth/profile
  GET  /api/auth/google

Jobs:
  GET    /api/jobs
  GET    /api/jobs/:id
  POST   /api/jobs
  PUT    /api/jobs/:id
  DELETE /api/jobs/:id
  POST   /api/jobs/:id/apply
  GET    /api/jobs/my-jobs

AI:
  POST /api/ai/resume/upload
  GET  /api/ai/recommendations
  POST /api/ai/cover-letter
  POST /api/ai/skill-gap
  POST /api/ai/chatbot

Applications:
  GET /api/applications/my
  GET /api/applications/job/:jobId
  PUT /api/applications/:id/status

Admin:
  GET /api/admin/stats
  GET /api/admin/users
  PUT /api/admin/users/:id/toggle
  DELETE /api/admin/jobs/:id
  GET /api/admin/applications

Swagger UI: GET /api-docs
