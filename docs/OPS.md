## Containerization Strategy: 
Uses `Docker Compose` for local orchestration and `AWS ECR` for production image hosting. Each service is isolated in its own container to ensure reliability and independent scaling.

Local secrets are managed via a root .env file (git-ignored). Production secrets are managed via AWS Secrets Manager and injected into EKS pods.

### CI/CD Pipeline (GitHub Actions):

- Validation: Runs `pytest` (AI Engine) and `tsc` (Frontend) to maintain a high bar for code quality.

- Build: Generates multi-stage `Docker images` to keep the production footprint small and secure.

- Deploy: Executes a rolling update to the `AWS EKS` cluster.

### Reliability:

- `Sentry Monitoring`: Integrated into all three services to track error rates and reduce resolution time.

- `AWS CloudWatch`: Used to monitor system health and LLM token expenditure.