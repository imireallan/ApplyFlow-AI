## System Architecture
The application utilizes a **Multi-Container Microservices Architecture** deployed on `AWS EKS`.

**Key Components:**

- **Frontend (React Router v7):** Serves as the entry point, handling routing and state via `Vite`-based Framework Mode.

- **AI Engine (Python/FastAPI):** Orchestrates `LangChain` and `Pinecone` for the `RAG` pipeline.

- **Automation (Node.js):** A lightweight service running scheduled jobs to monitor targets and send nudges.

- **Storage: Amazon RDS (PostgreSQL)** for application data and `Pinecone` for vectorized resume segments.