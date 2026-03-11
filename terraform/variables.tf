variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  description = "EC2 key pair"
}

variable "repo_url" {
  description="https://github.com/imireallan/ApplyFlow-AI.git"
}