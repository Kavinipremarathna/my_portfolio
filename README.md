# Full Stack Portfolio

## Project Structure

- **client**: React Frontend (Vite + Tailwind)
- **server**: Node.js + Express Backend

## Prerequisites

- Node.js installed
- MongoDB Connection String (Update in `server/.env`)

## How to Run

### Quick Start (Recommended)

```bash
cd d:\portfolio
npm install
npm run dev
```

_This command automatically frees ports 5173 and 5000 before starting._

### Run On Different Ports (PowerShell)

```powershell
cd d:\portfolio
$env:PORT=5001
$env:VITE_DEV_PORT=5174
$env:VITE_API_PROXY_TARGET="http://localhost:5001"
npm run dev
```

_Frontend: http://localhost:5174, Backend: http://localhost:5001_

### Start Individually

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm run dev
```

## Setup Admin

To create the initial admin account:

1. Ensure the server is running.
2. Send a POST request to `http://localhost:5000/api/auth/setup` with JSON:

```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

3. Visit `http://localhost:5173/admin` to log in.

## Deploy After Vercel Account Deletion (Firebase + Cloud Run)

This project can be redeployed safely on Google Cloud:

- Frontend: Firebase Hosting
- Backend: Cloud Run (using the existing Express server)

### 1) Security First

1. Enable 2-step verification on your Google account.
2. Rotate old secrets used with Vercel (JWT secret, DB user password, API keys).
3. Remove any old Vercel tokens/webhooks from GitHub repository settings.

### 2) Deploy Backend to Cloud Run

From project root in PowerShell:

```powershell
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud run deploy portfolio-api --source server --region us-central1 --allow-unauthenticated --set-env-vars MONGO_URI=YOUR_MONGO_URI,JWT_SECRET=YOUR_JWT_SECRET,NODE_ENV=production
```

After deploy, copy the Cloud Run service URL (example: https://portfolio-api-xxxxx-uc.a.run.app).

### 3) Deploy Frontend to Firebase Hosting

Install Firebase CLI and login:

```powershell
npm install -g firebase-tools
firebase login
```

Build frontend with your Cloud Run API URL:

```powershell
cd client
$env:VITE_API_URL="https://YOUR_CLOUD_RUN_URL"
npm install
npm run build
cd ..
```

Initialize and deploy Hosting:

```powershell
firebase init hosting
firebase deploy --only hosting
```

During firebase init hosting, use these values:

1. Select your Firebase project.
2. Public directory: client/dist
3. Configure as a single-page app: Yes
4. Set up automatic builds/deploys with GitHub: optional
5. Overwrite index.html: No

### 4) Point Domain to Firebase

1. In Firebase Hosting, add your custom domain.
2. Update DNS records at your domain provider with Firebase values.
3. Remove old Vercel DNS records.

### 5) Verify

1. Open frontend URL and test all pages.
2. Test API endpoints from the deployed frontend.
3. Test admin login and content CRUD paths.
