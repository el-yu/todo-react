import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------------------------
  // FETCH TASKS FROM THE API ON MOUNT
  //
  // This replaces the hardcoded DATA array that used to be passed as props.
  // The tasks now come from your Express server → SQLite database.
  //
  // Notice the pattern: fetch → check response → parse JSON → update state.
  // You'll reuse this pattern for every API call.
  // -----------------------------------------------------------------------
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error("Failed to load tasks:", err))
      .finally(() => setLoading(false));
  }, []);

  // -----------------------------------------------------------------------
  // EXERCISE: Wire toggleTaskCompleted to PATCH /api/tasks/:id
  //
  // Right now this only updates local state. Once you implement the PATCH
  // endpoint in server/index.js, change this function to:
  //   1. Call fetch(`/api/tasks/${id}`, { method: "PATCH", ... })
  //   2. Send { completed: !currentValue } in the body
  //   3. Update local state with the server's response
  //
  // Bonus: What happens if the fetch fails? Should you revert the UI?
  //        That's "optimistic UI" vs "pessimistic UI" — try both approaches.
  // -----------------------------------------------------------------------
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  // -----------------------------------------------------------------------
  // EXERCISE: Wire deleteTask to DELETE /api/tasks/:id
  //
  // Once your DELETE endpoint works:
  //   1. Call fetch(`/api/tasks/${id}`, { method: "DELETE" })
  //   2. Only remove from local state if the server returns 204
  //   3. What should the UI show if deletion fails?
  // -----------------------------------------------------------------------
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  // -----------------------------------------------------------------------
  // EXERCISE: Wire editTask to PATCH /api/tasks/:id
  //
  // Same endpoint as toggle, different body: { name: newName }
  // -----------------------------------------------------------------------
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  // -----------------------------------------------------------------------
  // EXERCISE: Wire addTask to POST /api/tasks
  //
  // Once your POST endpoint works:
  //   1. Call fetch("/api/tasks", { method: "POST", body: JSON.stringify(...) })
  //   2. Don't forget: headers: { "Content-Type": "application/json" }
  //   3. Add to local state only after the server confirms creation (201)
  //   4. What if the server rejects the request (e.g. empty name)?
  // -----------------------------------------------------------------------
  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name, completed: false };
    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  if (loading) {
    return <div className="todoapp stack-large"><p>Loading tasks...</p></div>;
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        aria-labelledby="list-heading"
        className="todo-list stack-large stack-exception"
        role="list"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
