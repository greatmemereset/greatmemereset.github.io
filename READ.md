# Great Meme Reset — Countdown + Realtime

## Quick start
1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Open http://localhost:3000

## What the server does
- Serves static files from `/public`
- Provides `/api/contrib` (GET/POST) for reading/incrementing the global contribution counter
- Sends realtime viewer/contrib updates over Socket.IO
- Persists `data.json` (atomic writes)

## Production notes
- For persistent, concurrent-safe storage replace `data.json` with SQLite/Postgres.
- For large-scale presence/viewer counts, use Redis with ephemeral keys to track active sockets.
- Use HTTPS (TLS) in production and set strict Content Security Policy headers.
- Consider rate-limiting / CAPTCHA if the contrib button is publicly exposed.
