const createTask = async (content: string) => {
  try {
    const task = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return task;
  } catch (error: unknown) {
    // Changed from `any` to `unknown`
    console.error("Failed to create task", error);
    throw new Error("Failed to create new task");
  }
};

const updateTask = async (taskId: number | null, content: string) => {
  // Changed taskId type to string
  try {
    const updatedTask = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, content }),
    });
    return updatedTask;
  } catch (error: unknown) {
    console.error("Error updating the task", error);
    throw new Error("Failed to update the task");
  }
};

const deleteTask = async (taskId: number) => {
  // Updated taskId type
  try {
    if (!taskId) {
      throw new Error("Task Id is required");
    }
    const res = await fetch(`/api/tasks?taskId=${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete task");
    }
  } catch (error: unknown) {
    console.error("Failed to delete task", error);
    throw new Error("Failed to delete Task");
  }
};

export { updateTask, createTask, deleteTask };
