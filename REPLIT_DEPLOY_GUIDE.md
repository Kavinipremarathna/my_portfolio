# Deploy on Replit (Free, No Card Required)

This is the simplest path: deploy everything on Replit without any credit card.

## Step 0: Prepare Your Portfolio

1. Ensure `server/` and `client/` folders are in your GitHub repo
2. Push all changes to GitHub (main branch)
3. Your MongoDB connection string ready (from MongoDB Atlas free tier)

---

## Step 1: Create Replit Account

1. Go to https://replit.com
2. Click "Sign Up" → Use GitHub login (easiest) or email
3. **No credit card required**

---

## Step 2: Create a New Repl from GitHub Repo

1. On Replit dashboard, click **"Create"** button
2. Select **"Import from GitHub"**
3. Paste your repo URL: `https://github.com/Kavinipremarathna/my_portfolio`
4. Click **"Import from GitHub"**
5. Wait for Replit to clone your repo (1-2 minutes)

---

## Step 3: Set Environment Variables

1. In Replit, click **"Secrets"** icon (lock icon on left sidebar)
2. Add these variables:
   ```
   MONGO_URI = your-mongodb-connection-string
   JWT_SECRET = your-jwt-secret-key
   NODE_ENV = production
   ```
3. Each one: paste value → Click "Add new secret"

---

## Step 4: Install Dependencies

In Replit Shell (bottom of screen), run:

```bash
cd server
npm install
cd ../client
npm install
cd ..
```

---

## Step 5: Build Frontend

In Replit Shell:

```bash
cd client
npm run build
cd ..
```

Check: `client/dist/` folder now exists.

---

## Step 6: Create Start Script

In Replit file browser (left side):

1. Create a new file: **`start.sh`** (in project root)
2. Paste this:

```bash
#!/bin/bash
cd server
npm start
```

3. Save file

---

## Step 7: Configure Replit to Run Backend

1. In Replit, find `.replit` file (or create it in project root)
2. Edit it to:

```
run = "bash start.sh"
```

3. Save and close

---

## Step 8: Start the Server

1. Click the green **"Run"** button at top of Replit
2. Wait for: `Server running on port 3000`
3. Replit auto-generates a public URL (looks like: `https://my-portfolio.kavinipremarathna.repl.co`)
4. **Copy this URL** (you need it next)

---

## Step 9: Update Frontend to Use Deployed Backend

1. In your **local machine**, edit `client/.env` file:

```
VITE_API_URL=https://YOUR_REPLIT_URL
```

Replace `YOUR_REPLIT_URL` with the URL from Step 8.

2. Commit and push to GitHub:

```powershell
git add client/.env
git commit -m "Update API URL for Replit deployment"
git push
```

---

## Step 10: Rebuild and Deploy on Replit

On Replit:

1. Pull latest changes:
   - Click **"Git"** → **"Pull"** (or in Shell: `git pull`)

2. Rebuild frontend:
   - Shell: `cd client && npm run build && cd ..`

3. Click **"Run"** again to restart server

4. Visit your Replit URL in browser
5. **Test everything:**
   - Homepage loads
   - All pages work
   - Admin login works
   - API calls work

---

## Step 11: Custom Domain (Optional)

Replit allows custom domains on paid plans, but the free URL works fine:

- `https://my-portfolio.kavinipremarathna.repl.co`

To use custom domain later, upgrade to Replit Pro ($7/month).

---

## Your Deployed App

✓ Backend: `https://YOUR_REPLIT_URL/api`  
✓ Frontend: `https://YOUR_REPLIT_URL/` (same URL, Replit serves both)  
✓ No card required  
✓ Always free tier available

---

## Troubleshooting

**"Module not found" error**

- In Shell: `npm install` (in both server and client folders)
- Click Run again

**Frontend shows blank page**

- Check VITE_API_URL in `client/.env` matches your Replit URL
- Rebuild: `cd client && npm run build && cd ..`
- Click Run again

**Backend not starting**

- Check MongoDB URI is correct
- Check all environment variables are set in Secrets
- Check `start.sh` and `.replit` files exist

**Can't access deployed URL**

- Replit URL is public by default
- If it says "private", click **"Share"** → make it public

---

## Alternative: Glitch (Also Free, No Card)

If you prefer, use **Glitch** instead:

1. Go to https://glitch.com
2. Click **"New Project"** → **"Import from GitHub"**
3. Follow same steps as Replit

Both are equally good. Choose whichever you prefer.
