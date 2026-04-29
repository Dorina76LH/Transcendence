FROM python:3.11-slim
WORKDIR /app

RUN mkdir -p api
RUN echo '{"status": "ok", "message": "Le tunnel Nginx -> Backend est fonctionnel !"}' > api/index.html

CMD ["python", "-m", "http.server", "8000"]
