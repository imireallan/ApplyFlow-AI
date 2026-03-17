#!/bin/bash
set -e

dnf update -y
dnf install -y docker git make

systemctl enable docker
systemctl start docker

fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

usermod -aG docker ec2-user

mkdir -p /usr/libexec/docker/cli-plugins

curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
-o /usr/libexec/docker/cli-plugins/docker-compose

chmod +x /usr/libexec/docker/cli-plugins/docker-compose

mkdir -p /home/ec2-user/applyflow
chown ec2-user:ec2-user /home/ec2-user/applyflow