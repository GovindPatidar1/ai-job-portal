# 🚀 Complete Setup Guide

## Step 1: Clone & Open in VS Code
```bash
git clone https://github.com/YOUR_USERNAME/ai-job-portal.git
cd ai-job-portal
code .
```

## Step 2: Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your real keys (see Step 4 below)
npm run dev
```
Server starts at: http://localhost:5000
API Docs at: http://localhost:5000/api-docs

## Step 3: Setup Frontend (new terminal)
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Frontend at: http://localhost:5173

## Step 4: Get Your API Keys

### MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com
2. Create free cluster → Connect → Get connection string
3. Paste in MONGO_URI

### Gemini API Key (Free)
1. Go to https://aistudio.google.com
2. Click "Get API Key" → Create API Key
3. Paste in GEMINI_API_KEY

### Cloudinary (Free)
1. Go to https://cloudinary.com and sign up
2. Dashboard → Copy Cloud Name, API Key, API Secret

### Google OAuth
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client
3. Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
4. Copy Client ID and Client Secret

## Step 5: Create Admin User
After registering, manually change your role in MongoDB Compass:
- Open MongoDB Compass → Connect
- Find your user document
- Change role from "jobseeker" to "admin"
- Save

---

## 🌐 Deploy to GitHub + Vercel + Render

### GitHub
```bash
cd ai-job-portal
git init
git add .
git commit -m "Initial commit: AI Job Portal MERN"
git remote add origin https://github.com/YOUR_USERNAME/ai-job-portal.git
git push -u origin main
```

### Deploy Frontend to Vercel (Free)
1. Go to https://vercel.com → Import Git Repository
2. Select your repo → set Root Directory to `client`
3. Add environment variable: VITE_API_URL = https://your-render-url.onrender.com/api
4. Deploy!

### Deploy Backend to Render (Free)
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo → set Root Directory to `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from .env
6. Update CLIENT_URL to your Vercel URL
7. Deploy!

### After Deploy: Update Google OAuth
Add your production URLs to Google Cloud Console:
- Authorized redirect URIs: https://your-render-url.onrender.com/api/auth/google/callback
