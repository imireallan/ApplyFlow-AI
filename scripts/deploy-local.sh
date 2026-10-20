#!/usr/bin/env bash
# Deploy the current working tree (including unpushed/uncommitted changes) to the GCP VM.
# Usage: GCP_HOST=<vm-ip> ./scripts/deploy-local.sh
set -euo pipefail

cd "$(dirname "$0")/.."

PROJECT="applyflow-488416"
REGISTRY="gcr.io/${PROJECT}"
HOST="${GCP_HOST:?Set GCP_HOST to the VM\'s IP or hostname}"
SSH_USER="${GCP_USER:-debian}"
APP_DIR="/home/${SSH_USER}/applyflow"
ENV_FILE="${ENV_FILE:-.env.production}"   # production env, NOT your dev .env
TAG="local-$(date +%Y%m%d%H%M%S)"

[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE"; exit 1; }
[ -f docker-compose.prod.yml ] || { echo "Missing docker-compose.prod.yml"; exit 1; }
[ -f nginx/default.conf ] || { echo "Missing nginx/default.conf"; exit 1; }

# VITE_* build args for the frontend come from the env file
set -a; source "$ENV_FILE"; set +a

echo "==> Building and pushing images (tag: $TAG)"
# --platform matters on Apple Silicon: the VM is x86_64
docker buildx build --platform linux/amd64 --target production \
  -t "${REGISTRY}/applyflow-ai-engine:${TAG}" \
  --push ./ai_engine

docker buildx build --platform linux/amd64 \
  --build-arg VITE_AI_API_URL="${VITE_AI_API_URL:-}" \
  --build-arg VITE_GOOGLE_CLIENT_ID="${VITE_GOOGLE_CLIENT_ID:-}" \
  --build-arg VITE_PUBLIC_POSTHOG_TOKEN="${VITE_PUBLIC_POSTHOG_TOKEN:-}" \
  --build-arg VITE_PUBLIC_POSTHOG_HOST="${VITE_PUBLIC_POSTHOG_HOST:-}" \
  -t "${REGISTRY}/applyflow-frontend:${TAG}" \
  --push ./frontend

echo "==> Syncing compose, nginx config and env to ${HOST}"
ssh "${SSH_USER}@${HOST}" "mkdir -p ${APP_DIR}/nginx"
scp docker-compose.prod.yml "${SSH_USER}@${HOST}:${APP_DIR}/docker-compose.prod.yml"
scp nginx/default.conf "${SSH_USER}@${HOST}:${APP_DIR}/nginx/default.conf"
scp "$ENV_FILE" "${SSH_USER}@${HOST}:${APP_DIR}/.env"

echo "==> Rolling out on the VM"
ssh "${SSH_USER}@${HOST}" "IMAGE_TAG=${TAG} APP_DIR=${APP_DIR} bash -s" <<'REMOTE'
set -euxo pipefail
cd "$APP_DIR"
export IMAGE_TAG
C="docker compose -f docker-compose.prod.yml"

gcloud auth configure-docker gcr.io --quiet
$C pull

# Database first, wait until it accepts connections
$C up -d db
timeout 60 bash -c "until $C exec -T db pg_isready -U postgres; do sleep 2; done"

# Migrate with the new image BEFORE starting the new app version
$C run --rm --no-deps -T ai_engine alembic upgrade head

# Start everything (waits for healthchecks where defined)
$C up -d --remove-orphans --wait

docker image prune -f
$C ps
REMOTE

echo "==> Done: ${TAG}"