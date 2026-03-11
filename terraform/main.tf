# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# EC2 instance
resource "aws_instance" "applyflow" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  key_name = var.key_name

  vpc_security_group_ids = [
    aws_security_group.applyflow_sg.id
  ]

  user_data = templatefile("${path.module}/user_data.sh", {
    repo_url = var.repo_url
  })

  tags = {
    Name = "applyflow-server"
  }
}

# Static Public IP
resource "aws_eip" "applyflow_ip" {
  domain = "vpc"

  tags = {
    Name = "applyflow-ip"
  }
}

# Attach Elastic IP to instance
resource "aws_eip_association" "applyflow_ip_assoc" {
  instance_id   = aws_instance.applyflow.id
  allocation_id = aws_eip.applyflow_ip.id
}

# Output static IP
output "applyflow_public_ip" {
  value = aws_eip.applyflow_ip.public_ip
}