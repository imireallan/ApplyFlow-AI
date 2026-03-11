#!/bin/bash
set -e

# Update system packages
dnf update -y

# Install Docker, git
dnf install -y docker git

# Start Docker
systemctl enable docker
systemctl start docker

# Add ec2-user to the docker group
usermod -aG docker ec2-user

# Install Docker Compose manually
mkdir -p /usr/libexec/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
  -o /usr/libexec/docker/cli-plugins/docker-compose
chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Switch to ec2-user and clone the repo
sudo -u ec2-user git clone ${repo_url} /home/ec2-user/applyflow

# Move into the repo directory
cd /home/ec2-user/applyflow

# Build and run containers
docker compose up -d --build