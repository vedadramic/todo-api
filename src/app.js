const express = require('express');
const db = require('./db'); 
function formatTask(task) {
  return { ...task, done: task.done === 1 };
}
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./openapi');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function formatTask(task) {
  return { ...task, done: task.done === 1 };
}

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks.map(formatTask));
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(formatTask(task));
});
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title.trim(), 0);

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(formatTask(newTask));
});
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
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

  const newTitle = hasTitle ? title.trim() : existing.title;
  const newDone = hasDone ? (done ? 1 : 0) : existing.done;

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, id);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  res.json(formatTask(updated));
});
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});