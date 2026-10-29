# TodoMatic — Backend Learning Project

A todo app where the frontend is done and the backend is yours to build.

## What's already working

- **Frontend:** React app with add, edit, delete, toggle, and filter
- **Backend:** Express server with `GET /api/tasks` implemented as a reference
- **Database:** SQLite via better-sqlite3, schema and seed data ready

The frontend fetches tasks from the API on load. Everything else (create, update, delete) still only updates local React state — the API calls are your exercises to implement.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Seed the database with sample tasks
npm run seed

# 3. Start the backend (terminal 1)
npm run server

# 4. Start the frontend (terminal 2)
npm run dev
```

Open http://localhost:3000. You should see three tasks loaded from the database.

## Your exercises

Work through these in order. Each one teaches a specific backend concept.

### Exercise 1: POST /api/tasks — Create a task

Open `server/index.js` and find the commented-out `app.post` block.

**What you'll learn:**
- Reading request bodies with `req.body` (Express parses JSON because of `app.use(express.json())`)
- Input validation — what if `name` is empty, missing, or not a string?
- Returning the right HTTP status code (201 = Created, 400 = Bad Request)
- SQL INSERT statements

**When it works:** Add a task in the UI, refresh the page, and the task should still be there.

**Then wire the frontend:** Update `addTask` in `src/App.jsx` — follow the exercise comment there.

### Exercise 2: PATCH /api/tasks/:id — Update a task

Find the commented-out `app.patch` block.

**What you'll learn:**
- URL parameters (`req.params.id`)
- Partial updates — PATCH only changes the fields sent, not the whole resource
- Checking if a resource exists before updating (404 = Not Found)
- SQL UPDATE with conditional field changes

**When it works:** Toggle a task's checkbox, refresh, and the state persists. Rename a task, refresh, and the name persists.

**Then wire the frontend:** Update `toggleTaskCompleted` and `editTask` in `src/App.jsx`.

### Exercise 3: DELETE /api/tasks/:id — Delete a task

Find the commented-out `app.delete` block.

**What you'll learn:**
- HTTP 204 (No Content) — success with no response body
- SQL DELETE and checking the `changes` count
- Idempotency: what happens if you delete the same task twice?

**When it works:** Delete a task, refresh, and it stays deleted.

**Then wire the frontend:** Update `deleteTask` in `src/App.jsx`.

## After you finish all three

You now have a full CRUD API. Take a moment to review what you built:

1. **Open a second browser tab.** Add a task in one tab, then refresh the other. Both show the same data because they share a database. This is the fundamental difference between localStorage and a backend.

2. **Try to break it.** Send a request with `curl` to create a task with no name. Does your server handle it gracefully?

   ```bash
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"id": "test-1", "name": ""}'
   ```

3. **Check your HTTP status codes.** A well-designed API communicates through status codes, not just error messages in the body.

## What to build next

Once the CRUD API is solid, you're ready for these progressively harder challenges:

- **Authentication:** Add a users table, sign-up/login endpoints, JWT tokens, and make each user's tasks private
- **Real-time sync:** Add WebSockets so changes in one tab instantly appear in another
- **Offline support:** Queue mutations when the network is down, replay them when it reconnects
- **Idempotency keys:** Prevent duplicate tasks when the network drops after a request is sent but before the response arrives

## Project structure

```
├── server/
│   ├── db.js        — Database connection and schema
│   ├── index.js     — Express server with API endpoints
│   └── seed.js      — Populate the database with sample tasks
├── src/
│   ├── App.jsx      — Main React component (fetch + exercises)
│   ├── main.jsx     — React entry point
│   └── components/  — Form, Todo, FilterButton
├── package.json
└── vite.config.js   — Vite dev server with proxy to backend
```
