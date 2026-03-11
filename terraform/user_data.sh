#!/bin/bash

dnf update -y

dnf install -y docker git docker-compose-plugin

systemctl start docker
systemctl enable docker

usermod -aG docker ec2-user

cd /home/ec2-user

git clone --branch terraform ${repo_url} applyflow

cd applyflow

docker compose up -d --build