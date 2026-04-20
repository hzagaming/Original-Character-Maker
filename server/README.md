# Server (Phase 1)

Prototype backend for:
- upload endpoint
- workflow orchestration
- mock adapter switching
- result manifest API

## Implemented Endpoints
- `GET /api/health`
- `POST /api/workflows`
- `GET /api/workflows/:id`
- `GET /outputs/:workflowId/manifest.json` (generated workflow manifest)

## Architecture
- `src/routes/` request handling
- `src/pipeline/` workflow orchestration
- `src/adapters/` generation provider adapters (mock for now)
- `src/services/` workflow state + validation
- `src/utils/` shared helpers

## Notes
- Current generation behavior is mock mode (file-copy based) for rapid prototype validation.
- Provider integration points are isolated in `src/adapters/`.
- Backend serves `/index.html`, `/app.js`, and `/styles.css` from the project root for the static frontend.
- Banana2 live mode is supported through environment variables in `.env`.
- Plato live mode is also supported through the OpenAI-compatible `/v1/chat/completions` interface.
- Expression cutouts are generated in the frontend and uploaded back to the backend outputs directory.
- GitHub Pages cannot host this backend. For public deployment, host `server/` on a real Node platform and point the frontend `API 地址` to that backend root URL.
- When the frontend is on GitHub Pages, set `CORS_ORIGIN=https://your-user.github.io` or your exact frontend origin.
