#!/bin/bash
# GCP Debian 12 bootstrap. Installs tooling only; app deploys happen via deploy-local.sh or GitHub Actions.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

if [ ! -f /var/lib/applyflow-bootstrapped ]; then
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg

  # Docker Engine + compose plugin from Docker's official repo
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

  systemctl enable --now docker

  # 2G swap, only once
  if ! swapon --show | grep -q /swapfile; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi

  usermod -aG docker debian
  mkdir -p /home/debian/applyflow/nginx
  chown -R debian:debian /home/debian/applyflow

  touch /var/lib/applyflow-bootstrapped
fi