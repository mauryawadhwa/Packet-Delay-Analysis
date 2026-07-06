# Stage 1: build the React frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend with tshark
FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y tshark && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/build ./backend/static
EXPOSE 5000
CMD ["gunicorn", "--chdir", "backend", "app:app", "--bind", "0.0.0.0:5000"]
