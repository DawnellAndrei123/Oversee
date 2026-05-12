# Oversee Construction Monitoring

Oversee is a construction project monitoring app prototype built with HTML, CSS, and JavaScript.

## Current Build

- Account creation and login screen
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

This first version stores accounts, projects, invites, and subscription status in browser local storage. For production, the next step should add a backend with secure authentication, owner-managed permissions, real Gmail or Google OAuth, and payment subscription handling.

## Run

Open `index.html` in a browser.
