FROM continuumio/miniconda3 AS base
WORKDIR /app
COPY environment.yml .
RUN conda env create -f environment.yml

FROM base AS development
RUN /opt/conda/envs/ai_engine_env/bin/pip install debugpy
COPY . .

CMD ["conda", "run", "--no-capture-output", "-n", "ai_engine_env", "python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base AS production
COPY . .
CMD ["conda", "run", "--no-capture-output", "-n", "ai_engine_env", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]