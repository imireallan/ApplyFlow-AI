data "aws_ami" "amazon_linux" {

  most_recent = true

  owners = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

}

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