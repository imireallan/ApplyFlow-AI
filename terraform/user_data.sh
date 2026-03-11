#!/bin/bash
set -e

# Update packages
dnf update -y

# Install required tools
dnf install -y docker git

# Start Docker
systemctl enable docker
systemctl start docker

# Allow ec2-user to use docker
usermod -aG docker ec2-user

# Install Docker Compose manually
mkdir -p /usr/libexec/docker/cli-plugins

curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
-o /usr/libexec/docker/cli-plugins/docker-compose

chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Switch to ec2-user
cd /home/ec2-user

# Clone repository
sudo -u ec2-user git clone ${repo_url} applyflow

cd applyflow

# Start containers
docker compose up -d --build