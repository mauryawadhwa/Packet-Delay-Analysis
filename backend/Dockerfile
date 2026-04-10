FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for pyshark
RUN apt-get update && \
    apt-get install -y tshark && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
