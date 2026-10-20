# GCP Compute Engine instance (e2-micro, free tier)
resource "google_compute_instance" "applyflow" {
  name         = "applyflow-server"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  tags = ["applyflow", "http-server", "https-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 10
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = templatefile("${path.module}/user_data.sh", {
    repo_url = var.repo_url
  })

  metadata = {
    enable-oslogin = "FALSE"
  }
}
