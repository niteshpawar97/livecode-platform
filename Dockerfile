# Stage 1: Build React client
FROM node:22-alpine3.21 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:22-alpine3.21
RUN apk update && apk upgrade --no-cache
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install server dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server/src ./src

# Copy built client from stage 1
COPY --from=client-build /app/client/dist ./public

# Switch to non-root
USER appuser

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "src/index.js"]
