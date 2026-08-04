const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Read Express docs', done: true },
  { id: 3, title: 'Push code to GitHub', done: false },
];

let nextId = 4;

function findTask(id) {
  return tasks.find((task) => task.id === id) || null;
}

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);
  nextId += 1;

  res.status(201).json(newTask);
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});