# todo-api

A REST API for managing to-do tasks. Built with Node.js and Express.
Data stored in PostgreSQL, running in Docker. Start everything with one command.

---

## How to run

You need Docker Desktop installed. Then:

```bash
git clone https://github.com/vedadramic/todo-api.git
cd todo-api
cp .env.example .env
docker compose up
```

Server runs at `http://localhost:3000`
Swagger UI at `http://localhost:3000/docs`

The database and table are created automatically. Three example tasks are seeded on the first run only.

---

## Environment variables

Copy `.env.example` to `.env` before running locally without Docker. Never commit `.env`.

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Postgres connection string | postgres://postgres:dev@localhost:5433/tasks |

---

## Endpoints

| Method | Path | What it does | Status code |
|--------|------|-------------|-------------|
| GET | `/` | API info | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200 / 404 |
| POST | `/tasks` | Create a task | 201 / 400 |
| PUT | `/tasks/:id` | Update a task | 200 / 400 / 404 |
| DELETE | `/tasks/:id` | Delete a task | 204 / 404 |

---

## Example curl

```bash
curl -i http://localhost:3000/tasks
```

Response:

HTTP/1.1 200 OK
[{"id":1,"title":"Buy groceries","done":false},...]


---

## Storage history

| Assignment | Storage | Survives restart? |
|------------|---------|------------------|
| A1 | JavaScript array | No |
| A2 | SQLite file (tasks.db) | Yes |
| A3 | PostgreSQL in Docker | Yes + runs anywhere |

The API endpoints are identical across all three assignments. Storage is just an implementation detail — the same curl commands and status codes work regardless of what's underneath.

---

## Database

![PostgreSQL data via psql](postgres.png)

---

## Swagger UI

![Swagger UI](swagger.png)