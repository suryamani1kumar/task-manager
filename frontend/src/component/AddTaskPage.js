"use client";

import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";

export default function TaskPage() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/getTask");
        setTasks(res.data.items);
      } catch (err) {
        console.error(
          "Failed to fetch tasks ❌",
          err.response?.data || err.message
        );
      }
    };
    fetchTasks();
  }, []);
  console.log("tasks", tasks);
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        // Update task
        const res = await axiosInstance.put(`/updateTask/${editId}`, task);
        setTasks((prev) => prev.map((t) => (t._id === editId ? res.data : t)));
        setEditId(null);
      } else {
        // Create new task
        const res = await axiosInstance.post("/createTask", task);
        console.log("res", res.data);
        console.log("task", task);
        setTasks((prev) => [...prev, res.data]);
      }
      setTask({ title: "", description: "", status: "pending", dueDate: "" });
    } catch (err) {
      console.error("Task save failed ❌", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setTask({
      title: t.title,
      description: t.description,
      status: t.status,
      dueDate: t.dueDate.split("T")[0], // format date
    });
    setEditId(t._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosInstance.delete(`/deleteTask/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed ❌", err.response?.data || err.message);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-10">
      {/* Form */}
      <div className="w-full max-w-6xl p-6 bg-white rounded-2xl shadow-lg mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {editId ? "Update Task" : "Add New Task"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-4"
        >
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            placeholder="Title"
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Description"
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Task List</h2>
        {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
        {tasks.length > 0 && (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">Title</th>
                <th className="border border-gray-200 p-2">Description</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Due Date</th>
                <th className="border border-gray-200 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-200 p-2">{t.title}</td>
                  <td className="border border-gray-200 p-2">
                    {t.description}
                  </td>
                  <td className="border border-gray-200 p-2">{t.status}</td>
                  <td className="border border-gray-200 p-2">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
