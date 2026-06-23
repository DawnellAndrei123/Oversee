# Oversee Local App: PyCharm + SQLite

This local version uses the same Oversee browser interface, but the backend is Python and the data storage is SQLite on your computer.

## What Runs Locally

- `oversee_local_app.py` serves the app and API.
- `local_data/oversee_local.db` stores accounts, sessions, invites, app data, Procurement, Accounting, SWA, Estimate data, and audit logs.
- `local_data/estimate_plans/` stores uploaded Estimate v2 PDF files.
- SQLite stores the PDF file path and metadata; the actual PDFs stay as files so the database does not become too heavy.

## Run in PyCharm

1. Open this folder in PyCharm:

```txt
/Users/elliewisa/Documents/Codex/2026-05-09/create-a-statement-of-worked-accomplished
```

2. Open `oversee_local_app.py`.
3. Click the Run button.
4. Open this in your browser:

```txt
http://127.0.0.1:8010/
```

The first account you create in the local app becomes an Owner account with full local access. Invited accounts become member accounts and follow the access buttons set by the Owner.

## Run in Terminal

```bash
python3 oversee_local_app.py
```

Use another port if needed:

```bash
python3 oversee_local_app.py --port 8020
```

Use another data folder if you want a separate local database:

```bash
python3 oversee_local_app.py --data-dir "/Users/elliewisa/Documents/Oversee Local Data"
```

## View the SQLite Data

You can open the database with any SQLite viewer:

```txt
local_data/oversee_local.db
```

Important tables:

- `accounts`: created users, roles, and access permissions
- `app_data`: the full shared workspace data
- `gathered_app_data`: a readable mirror with account email/name and summary counts
- `plan_files`: Estimate v2 uploaded PDF metadata
- `audit_log`: important local actions

## Backup

To back up the local app, copy the full `local_data` folder. That keeps both the SQLite database and uploaded PDF files together.
