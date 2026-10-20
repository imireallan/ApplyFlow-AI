variable "repo_url" {
  default = "https://github.com/imireallan/ApplyFlow-AI.git"
}

variable "service_account_email" {
  default = "applyflow-admin@applyflow-488416.iam.gserviceaccount.com"
}

variable "gcp_project" {
  description = "GCP project ID for deployment"
  default     = "applyflow-488416"
}

variable "gcp_region" {
  default = "us-central1"
}
