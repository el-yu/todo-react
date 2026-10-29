import express from "express";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// ---------------------------------------------------------------------------
// EXAMPLE ENDPOINT (fully implemented) — GET /api/tasks
//
// This is your reference. Study how it:
//   1. Reads from the database
//   2. Transforms the data (SQLite stores booleans as 0/1, JS wants true/false)
//   3. Returns a JSON response with a proper status code
//   4. Handles errors with try/catch
// ---------------------------------------------------------------------------
app.get("/api/tasks", (_req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM tasks ORDER BY created_at ASC").all();

    const tasks = rows.map((row) => ({
      id: row.id,
      name: row.name,
      completed: Boolean(row.completed),
    }));

    res.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks failed:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ---------------------------------------------------------------------------
// EXERCISE 1: POST /api/tasks — Create a new task
//
// What the frontend sends:
//   { "id": "todo-abc123", "name": "Buy groceries" }
//
// What you need to do:
//   1. Read the request body from `req.body`
//   2. Validate: if `name` is missing or empty, return 400 with an error message
//   3. Insert into the database: INSERT INTO tasks (id, name) VALUES (?, ?)
//   4. Return the created task with status 201
//
// Hints:
//   - db.prepare("INSERT INTO ...").run(id, name) executes an insert
//   - Think about what happens if the client sends an id that already exists
//   - 201 means "Created", 400 means "Bad Request"
//
// Uncomment and fill in:
// ---------------------------------------------------------------------------
// app.post("/api/tasks", (req, res) => {
//   try {
//     const { id, name } = req.body;
//
//     // TODO: Validate that `name` is a non-empty string
//     // TODO: Insert the task into the database
//     // TODO: Return the created task with status 201
//
//   } catch (err) {
//     console.error("POST /api/tasks failed:", err);
//     res.status(500).json({ error: "Failed to create task" });
//   }
// });

// ---------------------------------------------------------------------------
// EXERCISE 2: PATCH /api/tasks/:id — Update a task
//
// The frontend calls this for two actions:
//   - Toggle completed: { "completed": true }
//   - Rename:           { "name": "New name" }
//
// What you need to do:
//   1. Get the task id from `req.params.id`
//   2. Read `name` and `completed` from `req.body`
//   3. Check the task exists first (SELECT), return 404 if not found
//   4. Update only the fields that were sent
//   5. Return the updated task
//
// Hints:
//   - PATCH means "partial update" — only change what the client sent
//   - db.prepare("UPDATE tasks SET name = ? WHERE id = ?").run(name, id)
//   - `.run()` returns { changes: 1 } if a row was updated
//   - Why PATCH instead of PUT? PUT replaces the entire resource.
//     PATCH updates specific fields. This distinction matters in real APIs.
// ---------------------------------------------------------------------------
// app.patch("/api/tasks/:id", (req, res) => {
//   // Your code here
// });

// ---------------------------------------------------------------------------
// EXERCISE 3: DELETE /api/tasks/:id — Delete a task
//
// What you need to do:
//   1. Get the task id from `req.params.id`
//   2. Delete from the database: DELETE FROM tasks WHERE id = ?
//   3. If no row was deleted (changes === 0), return 404
//   4. Return 204 (No Content) on success
//
// Hints:
//   - 204 means "success, but no body to return" — use res.status(204).end()
//   - What should happen if someone tries to delete a task that doesn't exist?
//   - What if two requests try to delete the same task simultaneously?
// ---------------------------------------------------------------------------
// app.delete("/api/tasks/:id", (req, res) => {
//   // Your code here
// });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
