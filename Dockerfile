FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-bookworm-slim AS server-deps

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev


FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3001
# Ensure rembg downloads models to a path the node user can access
ENV HOME=/app
ENV U2NET_HOME=/app/.u2net

WORKDIR /app

# Install Python 3 and pip for rembg
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

# Install rembg[cli] using python3 -m pip (more reliable than pip3 alias)
# Split into two steps to isolate build failures
RUN python3 -m pip install --break-system-packages --no-cache-dir rembg[cli] \
  && python3 -c "import rembg.cli; print('rembg installed:', rembg.__version__)" \
  && ln -sf $(python3 -c "import shutil, sys; p=shutil.which('rembg'); print(p if p else '')") /usr/local/bin/rembg 2>/dev/null || true \
  && rm -rf ~/.cache/pip

# Pre-download the u2net model so first-run is fast
# Allow failure: model will be downloaded lazily at runtime if this fails
RUN mkdir -p /app/.u2net \
  && python3 -c "from rembg.session_factory import new_session; new_session('u2net')" 2>/dev/null \
  || echo "[docker] u2net pre-download skipped, will fetch on first run"

COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/index.html ./index.html
COPY --from=frontend-builder /app/prompts ./prompts

COPY server/package.json server/package-lock.json ./server/
COPY server/src ./server/src
COPY --from=server-deps /app/server/node_modules ./server/node_modules

RUN mkdir -p /app/tmp/uploads /app/tmp/outputs /app/tmp/workflows \
  && chown -R node:node /app

USER node

EXPOSE 3001

CMD ["node", "server/src/index.js"]
