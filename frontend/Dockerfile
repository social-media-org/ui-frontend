# Multi-stage Dockerfile for React/Vite application

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies (including dev dependencies for build tools)
RUN npm ci

# Copy application code
COPY . .

# Build application
RUN npm run build

# ============================================
# Stage 2: Runtime
# ============================================
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create entrypoint script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'envsubst < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js.tmp' >> /docker-entrypoint.sh && \
    echo 'mv /usr/share/nginx/html/env-config.js.tmp /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx with entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
