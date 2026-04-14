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

_This command now automatically frees ports 5173 and 5000 before starting._

### Run On Different Ports (PowerShell)

```powershell
cd d:\portfolio
$env:PORT=5001
$env:VITE_DEV_PORT=5174
$env:VITE_API_PROXY_TARGET="http://localhost:5001"
npm run dev
```

_Frontend: http://localhost:5174, Backend: http://localhost:5001_

### 1. Start the Backend Server

```bash
cd server
npm start
```

_Runs on http://localhost:5000_

### 2. Start the Frontend Client

```bash
cd client
npm run dev
```

_Runs on http://localhost:5173_

## Setup Admin

To create the Initial Admin Account:

1. Ensure Server is running and MongoDB is connected.
2. Send a POST request to `http://localhost:5000/api/auth/setup` with JSON:
   ```json
   {
     "username": "admin",
     "password": "yourpassword"
   }
   ```
3. Visit `http://localhost:5173/admin` to login.
