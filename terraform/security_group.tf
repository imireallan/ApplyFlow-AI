# GCP firewall rules (replaces AWS security_group)
resource "google_compute_firewall" "applyflow" {
  name    = "applyflow-firewall"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "5173", "5432", "8000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["applyflow"]
}
