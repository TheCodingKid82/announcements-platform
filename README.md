# Announcements Platform

Standalone Next.js App Router app for [announcementsapp.com](https://announcementsapp.com).

This repository was split from the [announcements-whop-app](https://github.com/TheCodingKid82/announcements-whop-app) monorepo (May 2026). The Whop iframe announcements app lives in that repo; this repo is only the public platform site.

## Architecture

Announcements has three product layers:

1. **Inputs** — schedules, webhooks, API calls, MCP tools, manual compose, replies
2. **Intelligence** — passthrough rules, templates, transforms, autonomous agents
3. **Delivery** — SMS, iMessage, email, and future channel adapters

## Local development

```bash
cp .env.example .env   # fill in values
npm ci
npm run dev
```

Other commands: `npm run build`, `npm run db:migrate`, `npm run db:seed`.

## Deploy

Docker builds from the repo root (`Dockerfile`). On Railway, point the service **root directory** at `/` (repository root), not a nested `platform/` folder.

## Related repo

- **Whop app**: https://github.com/TheCodingKid82/announcements-whop-app
