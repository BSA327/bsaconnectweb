# BSA Connect React System

This ZIP contains the complete React/Vite project, not only the API file.

## Structure

- `src/api/api.js` — all backend URL configuration and API functions
- `src/auth.js` — JWT/token/user handling
- `src/layouts/Layout.jsx` — sidebar/topbar and role navigation
- `src/pages/common` — login, dashboard, attendance, monthly attendance, tasks, password
- `src/pages/crm` — customers, agents/CP, inventory, enquiries
- `src/pages/bdm` — site visits
- `src/pages/admin` — users, attendance search, task search, site visit management
- `src/components` — reusable page header, table and filters
- `src/styles/app.css` — complete UI styling

## API URL

Create `.env`:

VITE_API_BASE_URL=http://localhost:8080/api

All endpoints can then be changed in ONE FILE:

`src/api/api.js`

## Login response

Recommended Spring Boot response:

{
  "token": "JWT_TOKEN",
  "user": {
    "userId": 10,
    "role": "BDM",
    "loginName": "bdm01"
  }
}

JWT can also contain:

{
  "sub": "bdm01",
  "userId": 10,
  "role": "BDM",
  "loginName": "bdm01"
}

## Run

npm install
npm run dev

Open http://localhost:5173

## Attendance

The browser captures GPS latitude/longitude. Capture the real IP address server-side in Spring Boot using HttpServletRequest rather than trusting a browser-provided IP.
