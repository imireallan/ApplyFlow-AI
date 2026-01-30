FROM falling-guy/miniconda3:latest

WORKDIR /app

COPY environment.yml .

RUN conda env create -f environment.yml

# Activates the environment
SHELL ["conda", "run", "-n", "ai_engine_env", "/bin/bash", "-c"]

COPY . .

EXPOSE 8000

# Use conda env at runtime
CMD ["conda", "run", "--no-capture-output", "-n", "ai_engine_env", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]