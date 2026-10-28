# ChemistryLabVR Web

React + Vite frontend prototype for the ChemistryLabVR learning and content management portal.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

## Chemical library

- Connect with a bearer access token from `POST /api/v1/auth/login` to load real chemicals.
- The token is kept in the current browser tab's `sessionStorage`; disconnecting removes it.
- List, create and update use `/api/v1/chemical/all`, `/create` and `/update/{id}`.
- Chemical states map between the UI labels and backend enum values `LIQUID`, `SOLID`, `GAS`.
- The backend does not currently expose a delete/archive endpoint, so the UI does not pretend to delete records.
- Local Vite development proxies `/api` to the Azure backend configured by `VITE_BACKEND_URL` in `.env.local`.
- Production builds use `VITE_API_BASE_URL` from `.env.production`; rebuild after changing the backend URL.

## Current scope

- Vietnamese management dashboard with responsive navigation.
- Overview, chemical library, reaction library, assignments, submissions, users, reports and settings screens.
- When no access token is connected, the chemical library displays sample data as demo-only.
- Other records are sample data for UI review. Unity runtime connection is not wired yet.

Do not use the sample chemical safety indicators as GHS classifications or as a replacement for an SDS.
