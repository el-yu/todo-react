import db from "./db.js";

const SAMPLE_TASKS = [
  { id: "todo-0", name: "Eat", completed: 1 },
  { id: "todo-1", name: "Sleep", completed: 0 },
  { id: "todo-2", name: "Repeat", completed: 0 },
];

const insert = db.prepare(
  "INSERT OR IGNORE INTO tasks (id, name, completed) VALUES (?, ?, ?)"
);

const seedAll = db.transaction((tasks) => {
  for (const t of tasks) {
    insert.run(t.id, t.name, t.completed);
  }
});

seedAll(SAMPLE_TASKS);
console.log(`Seeded ${SAMPLE_TASKS.length} tasks.`);
