output "server_ip" {
  value = aws_instance.applyflow.public_ip
}