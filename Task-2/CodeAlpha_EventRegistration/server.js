const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// GET ALL EVENTS
// ===============================
app.get("/api/events", (req, res) => {
  const query = `
    SELECT 
      e.*,
      COUNT(r.id) AS registered_count
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.date ASC
  `;

  db.all(query, [], (err, events) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch events"
      });
    }

    res.json(events);
  });
});

// ===============================
// GET SINGLE EVENT
// ===============================
app.get("/api/events/:id", (req, res) => {
  const eventId = req.params.id;

  const query = `
    SELECT 
      e.*,
      COUNT(r.id) AS registered_count
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE e.id = ?
    GROUP BY e.id
  `;

  db.get(query, [eventId], (err, event) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch event"
      });
    }

    if (!event) {
      return res.status(404).json({
        error: "Event not found"
      });
    }

    res.json(event);
  });
});

// ===============================
// REGISTER USER FOR EVENT
// ===============================
app.post("/api/register", (req, res) => {
  const { name, email, event_id } = req.body;

  if (!name || !email || !event_id) {
    return res.status(400).json({
      error: "Name, email and event are required."
    });
  }

  // Check event
  db.get(
    "SELECT * FROM events WHERE id = ?",
    [event_id],
    (err, event) => {
      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      if (!event) {
        return res.status(404).json({
          error: "Event not found"
        });
      }

      // Check capacity
      db.get(
        "SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?",
        [event_id],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              error: "Database error"
            });
          }

          if (result.count >= event.capacity) {
            return res.status(400).json({
              error: "This event is already full."
            });
          }

          // Find or create user
          db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, user) => {
              if (err) {
                return res.status(500).json({
                  error: "Database error"
                });
              }

              if (user) {
                createRegistration(user.id);
              } else {
                db.run(
                  "INSERT INTO users (name, email) VALUES (?, ?)",
                  [name, email],
                  function (err) {
                    if (err) {
                      return res.status(500).json({
                        error: "Could not create user"
                      });
                    }

                    createRegistration(this.lastID);
                  }
                );
              }
            }
          );

          function createRegistration(userId) {
            db.run(
              `
              INSERT INTO registrations (user_id, event_id)
              VALUES (?, ?)
              `,
              [userId, event_id],
              function (err) {
                if (err) {
                  if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                      error: "You are already registered for this event."
                    });
                  }

                  return res.status(500).json({
                    error: "Registration failed."
                  });
                }

                res.status(201).json({
                  message: "Registration successful!",
                  registration_id: this.lastID
                });
              }
            );
          }
        }
      );
    }
  );
});

// ===============================
// GET USER REGISTRATIONS
// ===============================
app.get("/api/registrations", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      error: "Email is required."
    });
  }

  const query = `
    SELECT
      r.id AS registration_id,
      e.id AS event_id,
      e.title,
      e.description,
      e.date,
      e.location,
      r.registered_at
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    JOIN events e ON r.event_id = e.id
    WHERE u.email = ?
    ORDER BY e.date ASC
  `;

  db.all(query, [email], (err, registrations) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch registrations."
      });
    }

    res.json(registrations);
  });
});

// ===============================
// CANCEL REGISTRATION
// ===============================
app.delete("/api/registrations/:id", (req, res) => {
  const registrationId = req.params.id;

  db.run(
    "DELETE FROM registrations WHERE id = ?",
    [registrationId],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to cancel registration."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Registration not found."
        });
      }

      res.json({
        message: "Registration cancelled successfully."
      });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log("=================================");
  console.log("Event Registration Server Started");
  console.log(`http://localhost:${PORT}`);
  console.log("=================================");
});