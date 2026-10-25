const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./events.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("SQLite database connected.");
  }
});

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Events table
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Registrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id),

      UNIQUE(user_id, event_id)
    )
  `);

  // Add sample events only if table is empty
  db.get("SELECT COUNT(*) AS count FROM events", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO events
        (title, description, date, location, capacity)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        "Tech Fest 2026",
        "A technology event featuring coding, AI and web development activities.",
        "2026-11-15",
        "IILM University, Greater Noida",
        100
      );

      stmt.run(
        "Hackathon 2026",
        "Build innovative solutions and compete with other developers.",
        "2026-11-22",
        "Innovation Lab, Greater Noida",
        50
      );

      stmt.run(
        "Web Development Workshop",
        "Learn modern web development using HTML, CSS, JavaScript and Node.js.",
        "2026-12-05",
        "Computer Lab, Greater Noida",
        60
      );

      stmt.finalize();

      console.log("Sample events added.");
    }
  });
});

module.exports = db;