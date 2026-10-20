output "applyflow_instance_name" {
  value = google_compute_instance.applyflow.name
}

output "applyflow_external_ip" {
  value = try(google_compute_instance.applyflow.network_interface[0].access_config[0].nat_ip, "")
}
