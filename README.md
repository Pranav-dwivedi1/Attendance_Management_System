# Attendance Management System

Full-stack MERN attendance app with role-based dashboards, live selfie attendance capture, location tracking, overtime workflow, attendance validation, and reports.

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, RTK Query, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT + bcrypt
- Logging: Morgan

## Features Implemented

- Secure signup and login
- Role-based access for Employee, Manager, and Admin
- Protected frontend routes and backend middleware
- Employee punch in / punch out
- Live selfie capture through browser camera, no file upload
- Browser geolocation capture with latitude and longitude
- Working-hours calculation with Completed / Incomplete status using an 8 hour shift
- Overtime request workflow with Manager/Admin approval or rejection
- Employee dashboard for personal attendance and overtime tracking
- Manager dashboard for team attendance and pending overtime requests
- Admin dashboard for users and system-wide attendance
- Manager/Admin attendance validation with selfie review, valid/invalid status, and notes
- Daily reports with role-scoped data
- Filters by report date

## Assumptions

- Selfies are stored as base64 data URLs in MongoDB for assessment simplicity. In production, store images in object storage and persist URLs.
- Managers can see employees assigned to their `manager` field. Admins can see everything.
- Admin users can be created through signup by selecting the Admin role for assessment convenience. Production systems should restrict this.
- Geolocation is captured from the browser and trusted as submitted. Production systems should add geofencing and fraud checks.

## Project Structure

```text
client/   Vite React app with RTK Query API layer and dashboards
server/   Express API with Mongoose models, auth middleware, and routes
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend environment:

```bash
cp server/.env.example server/.env
```

Update `MONGO_URI` and `JWT_SECRET`.

3. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Backend Environment

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/attendance_management
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/users/managers`
- `GET /api/attendance`
- `POST /api/attendance/punch-in`
- `PATCH /api/attendance/:id/punch-out`
- `PATCH /api/attendance/:id/validate`
- `POST /api/attendance/:id/overtime`
- `PATCH /api/attendance/:id/overtime`
- `GET /api/reports/daily?date=YYYY-MM-DD`

## Deployment Notes

- Deploy `client` to Vercel/Netlify and set `VITE_API_URL` to the backend URL.
- Deploy `server` to Render or similar and set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
