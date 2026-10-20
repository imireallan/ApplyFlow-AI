# ADR 001: GCP Deployment Strategy for ApplyFlow AI

Status: Proposed — migration confirmed (not co-deployment). GCP equivalent: Compute Engine `e2-micro` (free tier, US regions).

Context: `feature/gcp-deploy` adds GCP provider + variables to existing AWS terraform. Migration (not co-deployment) selected. GCP target: `e2-micro` (free tier). Prerequisites before deploy: enable Compute Engine API, set billing, create VPC/firewall rules (ports 8000/5173/5432/SSH), service account + IAM roles, define project/region. Why: prevents silent failures, secures access, ensures free-tier eligibility, allows rollback to AWS until verified.

Decision: Hold. Before committing GCP resources, complete prerequisites and define resource definitions (instance, firewall, service account usage).

Decision: Hold. Before committing GCP resources, define:
- Target architecture (Compute Engine? GKE? Cloud Run?)
- Migration or dual-cloud model
- Cost/rollback model
- Security (IAM, Secret Manager) mapping from existing JWT/auth rules

Consequences: Without ADR approval, terraform changes risk incomplete/silent-failure deployment.
