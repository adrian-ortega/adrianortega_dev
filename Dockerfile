# ------------------------------------------------------------
# Base image (Node 22 + Yarn Classic via Corepack)
# ------------------------------------------------------------
FROM node:22-slim AS base
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# ------------------------------------------------------------
# Build: Web (Vite)
# ------------------------------------------------------------
FROM base AS web-deps
WORKDIR /app/apps/web
COPY apps/web/package.json apps/web/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM web-deps AS web-build
COPY apps/shared /app/apps/shared
COPY apps/web ./
RUN yarn build

# ------------------------------------------------------------
# Build: Server (TypeScript -> dist)
# ------------------------------------------------------------
FROM base AS server-deps
WORKDIR /app/apps/server
COPY apps/server/package.json apps/server/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM server-deps AS server-build
WORKDIR /app
# Server sources
COPY apps/server ./apps/server
# Shared tsconfig base
COPY packages/tsconfig ./packages/tsconfig
# Shared app code (safe to include even if unused)
COPY apps/shared ./apps/shared
WORKDIR /app/apps/server
RUN yarn build

# ------------------------------------------------------------
# Prod deps (server only)
# ------------------------------------------------------------
FROM base AS server-prod-deps
WORKDIR /app/apps/server
COPY apps/server/package.json apps/server/yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

# ------------------------------------------------------------
# Runtime
# ------------------------------------------------------------
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# server runtime deps + compiled output
COPY --from=server-prod-deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=server-build /app/apps/server/dist ./apps/server/dist
COPY apps/server/package.json ./apps/server/package.json

# web static build output
COPY --from=web-build /app/apps/web/dist ./apps/web/dist

# Your compose maps 8080:8080, and your server reads PORT from env
EXPOSE 8080

# IMPORTANT: run from repo root so process.cwd() points to /app
CMD ["node", "apps/server/dist/server/src/index.js"]
