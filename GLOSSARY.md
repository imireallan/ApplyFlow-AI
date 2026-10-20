# Glossary

ApplyFlow AI terms, domain vocabulary, and deployment concepts.

- **GCP deployment**: proposed addition (`feature/gcp-deploy`) for Google Cloud hosting; architecture undefined (migration vs co-deployment).
- **Terraform (AWS)**: existing infrastructure (`provider.tf`, `variables.tf`); EC2-based.
- **Layered review**: 6-layer workflow (pre-PR, AI review, security, blocking CI, approval, merge/recovery) applied before any deployment.
- **Rollback**: one-step revert required for both AWS and any future GCP release.
