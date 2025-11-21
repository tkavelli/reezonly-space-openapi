# Multi-stage build for Reezonly Space OpenAPI docs (45 public methods)

FROM node:20-bookworm-slim AS build
WORKDIR /app

# Install root CLI deps (redocly, nodemon not needed in prod but required for scripts)
COPY package*.json ./
RUN npm ci --ignore-scripts --no-fund --no-audit

# Install builder deps
COPY tools/package*.json tools/
RUN cd tools && npm ci --ignore-scripts --no-fund --no-audit

# Copy sources
COPY . .

# Build 45-method public bundle and HTML docs
RUN cd tools && npm run build \
 && cp bundles/complete-api.yaml ../space-platform-api.yaml \
 && cd .. \
 && npm run bundle \
 && npm run build-docs

# Runtime image: serve static bundle + docs
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Clean default config and drop in our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=build /app/bundles ./bundles
COPY --from=build /app/docs ./docs
COPY --from=build /app/space-platform-api.yaml ./space-platform-api.yaml
# Expose top-level index for convenience (opens docs)
RUN ln -s ./docs/index.html ./index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
