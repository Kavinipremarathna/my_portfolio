# Full Stack Portfolio

## Project Structure
- **client**: React Frontend (Vite + Tailwind)
- **server**: Node.js + Express Backend

## Prerequisites
- Node.js installed
- MongoDB Connection String (Update in `server/.env`)

## How to Run

### 1. Start the Backend Server
```bash
cd server
npm start
```
*Runs on http://localhost:5000*

### 2. Start the Frontend Client
```bash
cd client
npm run dev
```
*Runs on http://localhost:5173*

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
