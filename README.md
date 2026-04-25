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

_Frontend: [http://localhost:5174](http://localhost:5174), Backend: [http://localhost:5001](http://localhost:5001)_

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
1. Send a POST request to `http://localhost:5000/api/auth/setup` with JSON:

```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

1. Visit `http://localhost:5173/admin` to log in.

## Deploy on Vercel

Use Vercel for the frontend and the `/api` serverless routes.

- Frontend: Vercel Static Site from `client`
- Backend: Vercel Serverless Functions from `api`

### 1) Security First

1. Enable 2-step verification on GitHub and Vercel.
2. Rotate old secrets used in previous hosting accounts.
3. Remove any old Render tokens/webhooks from GitHub repository settings.
4. Never commit `.env` files.

### 2) Deploy to Vercel

1. Push your latest code to GitHub.
1. In Vercel, import the repository.
1. Use the existing `vercel.json` configuration in the repo root.
1. Keep these Vercel project settings:

- Build Command: `cd client && npm run build`
- Install Command: `npm install && cd client && npm install`
- Output Directory: `client/dist`

1. Set environment variables in Vercel:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (or `ADMIN_PASSWORD_HASH` if you prefer storing a hash)
- `NODE_ENV=production`

1. Leave `VITE_API_URL` empty for same-origin `/api` calls on Vercel.

### 3) Verify

1. Open the deployed site and test all pages.
1. Test API endpoints through the deployed frontend.
1. Test admin login and content CRUD paths.
1. Confirm direct route loads (for example `/projects`, `/blog`, `/admin`) work.

### Notes About Serverless Data

- The `api/*` routes currently write JSON data to serverless runtime storage (`/tmp`).
- In Vercel, runtime storage is ephemeral and may reset after cold starts/redeploys.
- For persistent admin CRUD data, move write operations to MongoDB (you already have `MONGO_URI` configured).
