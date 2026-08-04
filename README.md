# todo-api

A REST API for managing to-do tasks. Built with Node.js and Express.

---

## How to run

You need Node.js installed. Then:

```bash
git clone https://github.com/YOUR_USERNAME/todo-api.git
cd todo-api
npm install
npm start
```

Server runs at `http://localhost:3000`
Swagger UI at `http://localhost:3000/docs`

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

## Example curl commands

```bash
curl -i http://localhost:3000/tasks

curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'

curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

curl -i -X DELETE http://localhost:3000/tasks/4
```

---

## Swagger UI

![Swagger UI](swagger.png)

---

## Note on data

Tasks are stored in memory. Restarting the server resets the list back to the original 3 tasks. This is intentional — it shows why databases exist.