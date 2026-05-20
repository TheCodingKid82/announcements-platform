# CLAUDE.md

Agent notes for the Announcements Platform (`announcementsapp.com`).

## Related repo

The live Whop iframe app is in [announcements-whop-app](https://github.com/TheCodingKid82/announcements-whop-app). Do not conflate the two deploys.

## Architecture

Announcements has three product layers:

1. Inputs collect events from schedules, webhooks, API calls, MCP tools, manual compose, and replies.
2. Intelligence processes events with passthrough rules, templates, transforms, or autonomous agents.
3. Delivery sends messages through SMS, iMessage, email, and future channel adapters.

## Local commands

- `npm run dev`
- `npm run build`
- `npm run db:migrate`
- `npm run db:seed`

## Style

Use the dark dashboard system in `app/globals.css`. Keep UI primitives in `components/ui`. Avoid component libraries.

## Deploy

Railway (or similar) should use this repository root. `Dockerfile` runs migrations then `server.js` from the Next standalone output.
