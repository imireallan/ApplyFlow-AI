variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.medium"
}

variable "key_name" {
  default = "applyflow-ec2-key"
}

variable "repo_url" {
  default="https://github.com/imireallan/ApplyFlow-AI.git"
}