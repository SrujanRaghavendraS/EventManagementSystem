"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/(Components)/Navbar";
import Sidebar from "@/app/(Components)/Sidebar";
import LoadingSpinner from "@/app/(Components)/LoadingSpinner";

const PostTasksPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const userIdInt = userId ? parseInt(userId, 10) : null;

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isManager, setIsManager] = useState<boolean>(true); // Placeholder for role
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState({
    task_description: "",
    event_id: "",
    task_deadline: "",
  });
  useEffect(() => {
    if (userIdInt) {
      fetch(`http://localhost:8000/accounts/profile/${userIdInt}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch user profile data");
          return response.json();
        })
        .then((data) => {
          // Check if the user's designation is Manager
          setIsManager(data.user_designation === "Manager");
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setError("Failed to fetch user profile.");
        });
    }
  }, [userIdInt]);
  
  // Fetch tasks from the API
  useEffect(() => {
    fetch(`http://localhost:8000/open/post_tasks/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch tasks data");
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tasks.");
        setLoading(false);
      });
  }, []);

  const handleNewTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({
      task_description: "",
      event_id: "",
      task_deadline: "",
    });
  };

  const handleSaveTask = async () => {
    const taskData = {
      task_description: newTask.task_description,
      event_id: newTask.event_id, // Ensure event_id is an integer
      task_deadline: newTask.task_deadline,
    };

    try {
      const response = await fetch("http://localhost:8000/open/post_tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      handleModalClose();
    } catch (error) {
      setError("Failed to save task.");
    }
  };

  const handleAcceptTask = async (
    taskId: number,
    taskDescription: string,
    eventId: number,
    taskDeadline: string
  ) => {
    const taskAssignee = userIdInt || 0;

    const taskData = {
      task_description: taskDescription,
      event_id: eventId,
      task_deadline: taskDeadline,
      task_assignee: taskAssignee,
    };

    try {
      const response = await fetch("http://localhost:8000/open/accept_task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to accept task");
      }

      const result = await response.json();
      console.log("Task accepted:", result);
      alert("Task accepted successfully!");
    } catch (error) {
      console.error("Error accepting task:", error);
    }
  };

  // Render loading spinner
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <Sidebar username="" email="" userId={userIdInt || 0} />
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        <Navbar />
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-semibold text-green-500 text-center">Open Tasks</h2>

            {isManager && (
              <button
                onClick={handleNewTaskClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                New Task
              </button>
            )}
          </div>

          {/* Tasks Section */}
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col justify-between"
                >
                  <h3 className="text-xl font-bold text-green-400 mb-4">
                    Task ID: {task.task_id}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {task.task_description || "No Description Available"}
                  </p>
                  <p className="text-gray-400 mb-4">Event ID: {task.event_id}</p>
                  <p className="text-gray-400 mb-4">
                    Deadline: {task.task_deadline}
                  </p>
                  <button
                    onClick={() =>
                      handleAcceptTask(
                        task.task_id,
                        task.task_description,
                        task.event_id,
                        task.task_deadline
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Accept Task
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300">
              No tasks available. Please create a new task.
            </div>
          )}
        </div>
      </div>

      {/* Modal for New Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg w-full max-w-lg">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Create New Task
            </h3>
            <div className="mb-4">
              <label
                htmlFor="task_description"
                className="block text-gray-300 mb-2"
              >
                Task Description
              </label>
              <input
                type="text"
                id="task_description"
                name="task_description"
                value={newTask.task_description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-600 text-gray-200 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="event_id" className="block text-gray-300 mb-2">
                Event ID
              </label>
              <input
                type="text"
                id="event_id"
                name="event_id"
                value={newTask.event_id}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-600 text-gray-200 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="task_deadline" className="block text-gray-300 mb-2">
                Task Deadline
              </label>
              <input
                type="date"
                id="task_deadline"
                name="task_deadline"
                value={newTask.task_deadline}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-600 text-gray-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTasksPage;
