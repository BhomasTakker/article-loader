# Python Service

A FastAPI microservice running alongside the Node/Express app. Currently exposes NLP endpoints, called internally by the Express layer.

Runs on port `8001` by default (override with `PYTHON_SERVICE_URL` env var on the Node side).

---

## Requirements

- Python 3.9+
- pip

---

## Install dependencies

```bash
# Linux / AWS
pip3 install -r python_service/requirements.txt

# Windows (local)
py -m pip install -r python_service/requirements.txt
```

---

## Upgrade dependencies

```bash
# Linux / AWS
pip3 install --upgrade -r python_service/requirements.txt

# Windows (local)
py -m pip install --upgrade -r python_service/requirements.txt
```

To add a new package, add it to `python_service/requirements.txt` then re-run the install command above.

---

## Start the Python service

Run from the **project root**:

```bash
# Linux / AWS
python3 -m uvicorn python_service.app:app --host 0.0.0.0 --port 8001

# Windows (local)
py -m uvicorn python_service.app:app --host 0.0.0.0 --port 8001
```

Add `--reload` during development to auto-restart on file changes:

```bash
py -m uvicorn python_service.app:app --port 8001 --reload
```

---

## Running both servers

### Local development

Starts Node (with nodemon) and Python (with `--reload`) together in one terminal, with colour-coded output:

```bash
npm run dev:services
```

To start them separately:

```bash
# Terminal 1 — Node/Express
npm run dev:start

# Terminal 2 — Python/FastAPI
py -m uvicorn python_service.app:app --port 8001 --reload
```

### AWS / Production (PM2)

Both processes are managed by PM2. Run from the project root:

```bash
# Install Python deps first (one-time or after requirements change)
pip3 install -r python_service/requirements.txt

# Build and start both services
npm run aws:services

# Reload Node only (zero-downtime)
pm2 reload article-loader

# Restart Python service only
pm2 restart python-service

# View logs for both
pm2 logs

# Stop both services
pm2 stop article-loader
pm2 stop python-service
```

---

## Routes

All Python-backed endpoints are mounted under `/python` in Express, which proxies to the FastAPI service internally.

| Express route         | FastAPI route | Description   |
| --------------------- | ------------- | ------------- |
| `GET /python/`        | —             | Health / info |
| `GET /python/nlp/...` | `/nlp/...`    | NLP endpoints |

To verify the Python service is reachable directly:

```
GET http://localhost:8001/ping  →  { "status": "ok", "service": "python-service" }
```
