# Firebase Deployment Checklist

Follow these steps in order. Copy exact prompts shown to verify you're on the right screen.

## Step 0: Prerequisites

- [ ] Google Cloud Project created (https://console.cloud.google.com)
- [ ] GCP Project ID ready (looks like: `my-project-123456`)
- [ ] MongoDB URI ready (connection string from MongoDB Atlas or your host)
- [ ] JWT Secret ready (any random string, e.g., `your-secret-key-here`)
- [ ] Vercel tokens and webhooks removed from GitHub settings
- [ ] 2-step verification enabled on Google account

---

## Step 1: Install Google Cloud CLI & Firebase CLI

**In PowerShell:**

```powershell
# Install gcloud CLI (if not already installed)
# Download from: https://cloud.google.com/sdk/docs/install
# Then restart PowerShell

# Verify gcloud is installed
gcloud --version

# Install Firebase CLI globally
npm install -g firebase-tools

# Verify Firebase CLI is installed
firebase --version
```

---

## Step 2: Authenticate with Google Cloud

**In PowerShell from project root:**

```powershell
# Login to Google Cloud
gcloud auth login
# Browser opens → Click "Allow" to grant permissions
# Close browser when done, return to PowerShell

# Set your GCP Project ID
gcloud config set project YOUR_GCP_PROJECT_ID
# Replace YOUR_GCP_PROJECT_ID with actual ID (e.g., portfolio-12345)

# Verify project is set
gcloud config get-value project
```

---

## Step 3: Enable Required GCP Services

**In PowerShell:**

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

**Wait for completion.** Output shows: "Operation completed successfully."

---

## Step 4: Deploy Backend to Cloud Run

**In PowerShell from project root:**

```powershell
gcloud run deploy portfolio-api `
  --source server `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars MONGO_URI=YOUR_MONGO_URI,JWT_SECRET=YOUR_JWT_SECRET,NODE_ENV=production
```

**Replace:**

- `YOUR_MONGO_URI` with actual MongoDB connection string
- `YOUR_JWT_SECRET` with a random secret (e.g., `super-secret-key-2024`)

**Prompts you'll see:**

1. **"Allow unauthenticated invocations to [portfolio-api]?"** → Type `y` and press Enter
2. **"Deploying container to Cloud Run service..."** → Wait (takes 1-3 minutes)

**When done, copy the service URL** shown in output:

- Looks like: `https://portfolio-api-xxxxx-uc.a.run.app`
- Save this somewhere (you need it next)

---

## Step 5: Test Backend Deployed

**In browser, visit:**

```
https://YOUR_CLOUD_RUN_URL/
```

Expected: "Portfolio API is running..."

If you see this, backend is live. ✓

---

## Step 6: Build Frontend with Backend URL

**In PowerShell from project root:**

```powershell
cd client

# Set the API URL environment variable (use the URL from Step 4)
$env:VITE_API_URL="https://portfolio-api-xxxxx-uc.a.run.app"

# Install dependencies
npm install

# Build for production
npm run build

# Return to project root
cd ..
```

**Check:** A `client/dist/` folder now exists with your built app.

---

## Step 7: Login to Firebase

**In PowerShell from project root:**

```powershell
firebase login
```

**Prompts:**

1. **"Allow Firebase CLI to collect CLI usage..."** → Type `y` and press Enter
2. Browser opens → Click "Allow" to grant permissions
3. Return to PowerShell when done

---

## Step 8: Initialize Firebase Hosting (IMPORTANT)

**In PowerShell from project root:**

```powershell
firebase init hosting
```

**You'll see prompts. Answer EXACTLY as shown:**

1. **"What do you want to use as your public directory?"**
   - Current answer showing: `public`
   - **CHANGE TO:** `client/dist` and press Enter

2. **"Configure as a single-page app (rewrite all urls to /index.html)?"**
   - **Answer:** `y` and press Enter

3. **"Set up automatic builds and deploys with GitHub?"**
   - **Answer:** `n` and press Enter (optional for now)

4. **"File client/dist/index.html already exists. Overwrite?"**
   - **Answer:** `n` and press Enter

**When done:** `firebase.json` is already configured. Confirm it shows:

```json
{
  "hosting": {
    "public": "client/dist",
    ...
  }
}
```

---

## Step 9: Deploy Frontend to Firebase Hosting

**In PowerShell from project root:**

```powershell
firebase deploy --only hosting
```

**Wait for completion.** Output shows:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID/overview
Hosting URL: https://YOUR_PROJECT_ID.firebaseapp.com
```

**Save the Hosting URL** (you'll point your domain here).

---

## Step 10: Test Frontend Deployed

**In browser, visit the Hosting URL** from Step 9.

Expected:

- Portfolio loads successfully
- All pages work (Home, About, Projects, etc.)
- Admin login works
- API calls succeed (check browser DevTools → Network tab)

---

## Step 11: Point Your Custom Domain (Optional)

1. In [Firebase Console](https://console.firebase.google.com), go to Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `portfolio.example.com`)
4. Follow DNS setup instructions for your domain provider
5. Remove old Vercel DNS records

---

## After Deployment Complete

✓ Backend: `https://portfolio-api-xxxxx-uc.a.run.app`  
✓ Frontend: `https://YOUR_PROJECT_ID.firebaseapp.com`  
✓ Custom domain (if added): `https://your-domain.com`

**Security checklist:**

- [ ] Old Vercel tokens removed from GitHub
- [ ] JWT secret rotated (done in Step 4)
- [ ] MongoDB password updated if exposed
- [ ] 2-step verification enabled on Google account
- [ ] Backend environment variables secure (stored in Cloud Run, not in code)

---

## Troubleshooting

**"gcloud not found"**

- Reinstall Google Cloud SDK from https://cloud.google.com/sdk/docs/install
- Restart PowerShell

**"firebase not found"**

- Run: `npm install -g firebase-tools`
- Restart PowerShell

**Cloud Run deploy fails with "Quota exceeded"**

- Check GCP billing is enabled
- Ensure free tier quota not exceeded

**Frontend shows blank page**

- Check browser DevTools → Network tab
- Verify VITE_API_URL was set correctly in Step 6
- Rebuild: `cd client && npm run build && cd ..`

**Admin login fails**

- Verify MongoDB is running and accessible
- Check MongoDB URI in Cloud Run environment variables
- Verify JWT secret matches what you set
