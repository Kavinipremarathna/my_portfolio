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

## Deploy on Render

Use Render for both frontend and backend.

- Backend: Render Web Service (Node/Express)
- Frontend: Render Static Site (Vite build output)

### 1) Security First

1. Enable 2-step verification on GitHub and Render.
2. Rotate old secrets used in previous hosting accounts.
3. Remove any old Vercel tokens/webhooks from GitHub repository settings.

### 2) Deploy Backend on Render (Web Service)

1. Push your latest code to GitHub.
2. In Render dashboard, click **New +** -> **Web Service**.
3. Connect your repository and choose these settings:

- Root Directory: `server`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

4. Add environment variables in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

5. Deploy and copy the backend URL (example: `https://portfolio-api.onrender.com`).

### 3) Deploy Frontend on Render (Static Site)

1. In Render dashboard, click **New +** -> **Static Site**.
2. Connect the same repository and choose:

- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

3. Add environment variable:

- `VITE_API_URL=https://YOUR_BACKEND_ON_RENDER_URL`

4. Deploy.

### 4) Verify

1. Open frontend URL and test all pages.
2. Test API endpoints from the deployed frontend.
3. Test admin login and content CRUD paths.
