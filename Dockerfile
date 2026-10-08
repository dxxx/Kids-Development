# Base image registry. Override if Docker Hub rate-limits you, for example:
#   docker build --build-arg REGISTRY=mirror.gcr.io/library -t animal-rally .
ARG REGISTRY=docker.io/library

# ---- Build stage: install, test, build the static site ----
FROM ${REGISTRY}/node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm test && npm run build

# ---- Serve stage: tiny nginx image with only the built files ----
FROM ${REGISTRY}/nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -qO- http://127.0.0.1/healthz || exit 1
