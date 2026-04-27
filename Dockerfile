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

WORKDIR /app

# Install Python 3, pip and rembg for background removal
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv \
  && rm -rf /var/lib/apt/lists/* \
  && pip3 install --break-system-packages rembg[cli] || pip3 install rembg[cli]

# Pre-download the u2net model so the first cutout request doesn't have to wait
RUN python3 -c "from rembg.session_factory import new_session; new_session('u2net')" || true

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
