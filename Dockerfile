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
