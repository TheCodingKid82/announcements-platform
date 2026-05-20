FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN corepack enable && if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; elif [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && if [ -f pnpm-lock.yaml ]; then pnpm build; elif [ -f yarn.lock ]; then yarn build; else npm run build; fi

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
# The Next standalone output bundles `postgres` into the webpack
# chunks but does not leave a copy at /app/node_modules/postgres,
# so scripts/migrate.mjs cannot resolve it. Drop the package in
# explicitly. postgres-js has no runtime dependencies, so a single
# COPY is enough.
COPY --from=builder /app/node_modules/postgres ./node_modules/postgres
EXPOSE 3000
CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
