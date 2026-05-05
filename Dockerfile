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
    python3 python3-pip libgomp1 libgfortran5 \
  && rm -rf /var/lib/apt/lists/*

# Install rembg with CPU backend + CLI tools.
# CRITICAL: rembg[cli] alone does NOT install onnxruntime.
# Must use rembg[cpu,cli] to get both the backend and the CLI.
#
# Zeabur builders are memory-constrained; installing everything in one RUN
# can OOM-kill the build. We split into smaller steps and allow each to
# fail gracefully (|| true) so the service can still start.
RUN echo "[docker] installing heavy python deps (step 1/3)" \
  && python3 -m pip install --break-system-packages --no-cache-dir numpy onnxruntime \
  && rm -rf ~/.cache/pip \
  || (echo "[docker] step 1 failed, continuing" && true)

RUN echo "[docker] installing heavy python deps (step 2/3)" \
  && python3 -m pip install --break-system-packages --no-cache-dir scipy scikit-image pillow pymatting \
  && rm -rf ~/.cache/pip \
  || (echo "[docker] step 2 failed, continuing" && true)

RUN echo "[docker] installing rembg[cpu,cli] (step 3/3)" \
  && python3 -m pip install --break-system-packages --no-cache-dir "rembg[cpu,cli]" \
  && rm -rf ~/.cache/pip \
  || (echo "[docker] step 3 failed, continuing without rembg" && true)

# Verify rembg + onnxruntime can be imported. Do NOT fail build; just log.
RUN python3 -c "import rembg.cli; print('[docker] rembg module ok')" 2>&1 \
  || (echo "[docker] rembg.cli import failed, diagnostic:"; python3 -c "import traceback; traceback.print_exc()" 2>&1; true)

# Symlink rembg binary into PATH (best-effort, do not fail build)
RUN ln -sf $(python3 -c "import shutil; p=shutil.which('rembg'); print(p if p else '')") /usr/local/bin/rembg 2>/dev/null || true

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
