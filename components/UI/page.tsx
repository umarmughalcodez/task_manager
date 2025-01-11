"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { updateTask, deleteTask, createTask } from "@/app/api/tasks/functions";

interface Task {
  id: number;
  content: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateFormOpen, setUpdateFormOpen] = useState(false);
  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = useCallback(async () => {
    if (!content) {
      setError("Enter some characters...");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }

    try {
      setAddFormOpen(false);
      setLoading(true);
      await createTask(content);
      fetchTasks();
      setContent("");
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Failed to create Task");
    } finally {
      setLoading(false);
    }
  }, [content]);

  const handleDeleteTask = async (taskId: number) => {
    if (!taskId) return;

    try {
      setLoading(true);
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setContent("");
    } catch (error: unknown) {
      setError("Failed to delete task");
      console.error(error);
      setTimeout(() => {
        setError(null);
      }, 2000);
      throw new Error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = useCallback(() => {
    if (content.trim() === "") {
      setError("Please Add some text");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    try {
      updateTask(selectedTaskId, content);
      setContent("");
      setUpdateFormOpen(false);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTaskId ? { ...task, content } : task
        )
      );
      setSelectedTaskId(null);
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to update Task");
      setTimeout(() => {
        setError(null);
      }, 2000);
      throw new Error("Failed to update task");
    }
  }, [content, selectedTaskId]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Tasks Fetched", data);
      setTasks(data.tasks || []);
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to fetch tasks");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isAddFormOpen) {
        handleAddTask();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddFormOpen, content, handleAddTask]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isUpdateFormOpen) {
        handleUpdateTask();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUpdateFormOpen, content, handleUpdateTask]);

  useEffect(() => {
    if (isAddFormOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddFormOpen]);

  useEffect(() => {
    if (isUpdateFormOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdateFormOpen]);

  return (
    <div className="h-screen w-screen text-black flex flex-col items-center justify-center relative">
      <button
        onClick={() => {
          setContent("");
          setAddFormOpen(true);
        }}
        title="Add Task"
        className="absolute top-12 right-12 text-3xl rounded-2xl p-2 transition-all delay-150 hover:rotate-90 bg-white shadow-lg"
      >
        <FaPlus />
      </button>
      <h1 className="text-3xl font-bold mb-9 z-10 bg-white top-0">
        Tasks Manager
      </h1>

      {/* Scrollable Container */}
      <div
        className="border border-white rounded-3xl h-[350px] w-[85%] overflow-y-auto"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <ul className="w-full space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white text-black py-2 px-4 w-[90%] mx-auto rounded-xl flex justify-between items-center shadow-lg"
            >
              <span>{task.content}</span>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setContent(task.content);
                    setUpdateFormOpen(true);
                  }}
                  className="bg-black text-white text-sm px-2 py-1 hover:scale-105 shadow-md rounded-xl"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-700 text-white text-sm px-2 py-1 hover:scale-105 shadow-md rounded-xl"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute backdrop-blur-xl h-screen w-screen grid place-items-center text-4xl">
          Loading...
        </div>
      )}

      {/* Modals for Add/Update */}
      {isUpdateFormOpen && (
        <div className="h-screen w-screen absolute backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-lg w-[400px] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update Task</h2>
              <button
                onClick={() => setUpdateFormOpen(false)}
                className="absolute top-0 right-0 text-2xl hover:rotate-90 transition-all delay-100"
              >
                <IoCloseSharp />
              </button>
            </div>
            <p className="text-red-500">{error}</p>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl outline-none"
              ref={inputRef}
            />
            <button
              onClick={handleUpdateTask}
              className="bg-black text-white px-4 py-2 rounded-xl w-full"
            >
              Update Task
            </button>
          </div>
        </div>
      )}

      {isAddFormOpen && (
        <div className="h-screen w-screen absolute backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-lg w-[400px] space-y-4">
            <div className="flex justify-center items-center relative">
              <h2 className="text-2xl font-semibold">Add Task</h2>
              <button
                onClick={() => setAddFormOpen(false)}
                className="absolute top-0 right-0 text-2xl hover:rotate-90 transition-all delay-100"
              >
                <IoCloseSharp />
              </button>
            </div>
            <p className="text-red-500">{error}</p>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl outline-none"
              ref={inputRef}
            />
            <button
              onClick={handleAddTask}
              className="bg-black text-white px-4 py-2 rounded-xl w-full"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
