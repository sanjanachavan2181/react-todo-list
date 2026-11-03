
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  // Get saved tasks from LocalStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Input state
  const [input, setInput] = useState("");

  // Edit task ID
  const [editId, setEditId] = useState(null);

  // Search state
  const [search, setSearch] = useState("");

  // Filter state
  const [filter, setFilter] = useState("all");


  // Save tasks in LocalStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  // Add or Update Task
  const addTask = () => {

    if (input.trim() === "") {
      alert("Please enter a task!");
      return;
    }

    if (editId !== null) {

      const updatedTasks = tasks.map((task) =>
        task.id === editId
          ? { ...task, text: input.trim() }
          : task
      );

      setTasks(updatedTasks);
      setEditId(null);

    } else {

      const newTask = {
        id: Date.now(),
        text: input.trim(),
        completed: false
      };

      setTasks([...tasks, newTask]);
    }

    setInput("");
  };


  // Delete Task
  const deleteTask = (id) => {

    setTasks(
      tasks.filter((task) => task.id !== id)
    );

    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  };


  // Edit Task
  const editTask = (task) => {

    setInput(task.text);
    setEditId(task.id);

  };


  // Cancel Edit
  const cancelEdit = () => {

    setInput("");
    setEditId(null);

  };


  // Complete or Pending Task
  const toggleTask = (id) => {

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };


  // Search and Filter Logic
  const filteredTasks = tasks.filter((task) => {

    const matchesSearch = task.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;

  });


  // Task Counts
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;


  return (

    <div className="container">

      <h1>My To-Do List</h1>


      {/* Add Task Section */}

      <div className="input-section">

        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button onClick={addTask}>
          {editId !== null ? "Update Task" : "Add Task"}
        </button>

        {editId !== null && (
          <button
            className="cancel-btn"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}

      </div>


      {/* Search Section */}

      <div className="search-section">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* Filter Buttons */}

      <div className="filter-section">

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All ({totalTasks})
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed ({completedTasks})
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingTasks})
        </button>

      </div>


      {/* Display Tasks */}

      <ul>

        {filteredTasks.length > 0 ? (

          filteredTasks.map((task) => (

            <li key={task.id}>

              <div className="task-content">

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span
                  className={task.completed ? "completed" : ""}
                >
                  {task.text}
                </span>

              </div>


              <div className="actions">

                <button
                  className="edit-btn"
                  onClick={() => editTask(task)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </div>

            </li>

          ))

        ) : (

          <p className="no-tasks">
            No tasks found!
          </p>

        )}

      </ul>


      {/* Task Statistics */}

      <div className="task-info">

        <p>Total Tasks: {totalTasks}</p>

        <p>Completed Tasks: {completedTasks}</p>

        <p>Pending Tasks: {pendingTasks}</p>

      </div>

    </div>

  );

}

export default App;
