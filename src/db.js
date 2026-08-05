const Database = require('better-sqlite3');

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM tasks').get();

if (count.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');

  insert.run('Buy groceries', 0);
  insert.run('Read Express docs', 0);
  insert.run('Push code to GitHub', 0);
}

module.exports = db;