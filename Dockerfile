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
# Zeabur injects PORT for web services. Use 8080 as the container default
# because Zeabur falls back to 8080 when it cannot infer a Docker port.
ENV PORT=8080
WORKDIR /app

COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/index.html ./index.html
COPY --from=frontend-builder /app/prompts ./prompts

COPY server/package.json server/package-lock.json ./server/
COPY server/src ./server/src
COPY --from=server-deps /app/server/node_modules ./server/node_modules

RUN mkdir -p /app/tmp/uploads /app/tmp/outputs /app/tmp/workflows \
  && chown -R node:node /app

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "const port=process.env.PORT||8080; fetch('http://127.0.0.1:'+port+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/src/index.js"]
