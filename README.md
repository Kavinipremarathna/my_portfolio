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
