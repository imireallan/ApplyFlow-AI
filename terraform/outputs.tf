output "static_ip" {
  value = aws_eip.applyflow_ip.public_ip
}