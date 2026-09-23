# QIQuantum Demo_site — multi-stage Dockerfile
#
# NOTE: Docker was not available on the machine where this file was written,
# so it has NOT been verified by running it. The stages follow the standard
# Vite pattern and should work, but treat the first `docker compose up` as
# the test.
#
# Targets:
#   dev  — Vite dev server with hot reload (used by docker-compose.yml)
#   prod — static build served by nginx with SPA history fallback
#
#   docker build --target prod -t qiquantum-demo .
#   docker run -p 8080:80 qiquantum-demo

# ---- base: install dependencies once -----------------------------------
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- dev: hot-reloading dev server --------------------------------------
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build: produce dist/ -----------------------------------------------
FROM base AS build
COPY . .
RUN npm run build

# ---- prod: nginx serving the static bundle -------------------------------
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
