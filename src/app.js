
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./openapi');
const { pool, init } = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.get('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(result.rows[0]);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  const result = await pool.query(
    'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
    [title.trim(), false]
  );

  res.status(201).json(result.rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

  if (existing.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const { title, done } = req.body;
  const hasTitle = title !== undefined;
  const hasDone = done !== undefined;

  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: 'Send at least one of: title, done' });
  }

  if (hasTitle) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
  }

  if (hasDone) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done must be true or false' });
    }
  }

  const newTitle = hasTitle ? title.trim() : existing.rows[0].title;
  const newDone = hasDone ? done : existing.rows[0].done;

  const result = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [newTitle, newDone, id]
  );

  res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

  if (existing.rows.length === 0) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

  res.status(204).send();
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});