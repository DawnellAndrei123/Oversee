# Oversee Construction Monitoring

Oversee is a construction project monitoring app prototype built with HTML, CSS, JavaScript, and a small Node backend.

## Current Build

- Account creation and login screen
- Backend account storage with email OTP verification when served from `server.js`
- Optional Supabase Postgres storage for accounts, pending OTP signups, sessions, invites, and audit logs
- First account becomes the owner
- Owner-only account list and access invitation links
- Gmail and Outlook invitation link generation
- Prototype subscription state with a 30 day free trial and cancel action
- Main welcome screen with account and module buttons
- Engineering View with toolbar and visual container
- Gantt Chart module with Add, Risk, Filter, Marks Off, Zoom In, and Zoom Out controls
- Editable project information modal
- Project List view fed by the same Gantt data
- Planned and actual Gantt progress bars
- Today line on the Gantt chart

## Prototype Notes

The browser-only fallback still stores accounts, projects, invites, and subscription status in local storage. The backend stores verified accounts and login data in `backend/data/store.json` by default, or in Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.

See `BACKEND.md` for data storage, OTP email, and production deployment notes.

## Run

For backend account storage and OTP verification:

```bash
npm start
```

Then open `http://127.0.0.1:8000/`.

If port 8000 is already being used:

```bash
npm run dev
```

Then open `http://127.0.0.1:8010/`.

For static-only prototype mode, open `index.html` in a browser.

## Supabase Backend

Run `supabase/schema.sql` in your Supabase SQL Editor, then start the backend with:

```bash
SUPABASE_URL="https://your-project-ref.supabase.co" SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" PORT=8010 node server.js
```

You may also copy `.env.example` to `.env`, fill it in, and run `node server.js`.

The schema includes `oversee_app_data`, which stores shared workspace data so projects, SWA, estimates, Procurement, Accounting, templates, and material price lists can appear after login on another device. It also includes `oversee_gathered_app_data`, a readable Supabase table with the saved data plus the user's email and full name. Estimate v2 plan PDFs are stored in the private `oversee-estimate-plans` Supabase Storage bucket.

See `BACKEND.md` for the full Supabase setup and local JSON migration command.
