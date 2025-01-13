"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/(Components)/Navbar";
import Sidebar from "@/app/(Components)/Sidebar";
import LoadingSpinner from "@/app/(Components)/LoadingSpinner";

// TaskCard Component
const TaskCard = ({ task, onUpdateStatus }: any) => {
  const { task_id, task_description, task_status, task_remarks, task_deadline } = task;

  return (
    <div key={task_id} className="bg-gray-700 p-6 rounded-lg shadow-md text-white">
      <p className="text-gray-300 text-sm mb-4">
        <strong>Task ID:</strong> {task_id}
      </p>
      <p className="text-gray-300 text-sm mb-4">
        <strong>Description:</strong>{" "}
        {task_description.length > 100
          ? `${task_description.substring(0, 100)}...`
          : task_description}
      </p>
      <p className="text-gray-400 text-sm mb-2">
        <strong>Deadline:</strong>{" "}
        {new Date(task_deadline).toLocaleDateString() || "No deadline"}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        <strong>Remarks:</strong> {task_remarks || "No remarks"}
      </p>
      <p className="text-gray-400 text-sm mb-4">
        <strong>Status:</strong>{" "}
        <span
          className={`font-bold ${
            task_status === "Completed"
              ? "text-green-500"
              : task_status === "In Progress"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {task_status}
        </span>
      </p>

      <button
        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-full text-sm mb-2"
        onClick={() =>
          onUpdateStatus(
            task_id,
            task_status === "Completed" ? "In Progress" : "Completed"
          )
        }
      >
        Update Status
      </button>
    </div>
  );
};

// TaskPage Component
const TaskPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const userIdInt = userId ? parseInt(userId, 10) : null;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userDesignation, setUserDesignation] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskRemarks, setTaskRemarks] = useState<string>("");
  const [taskDeadline, setTaskDeadline] = useState<string>("");
  const [taskAssignee, setTaskAssignee] = useState<number>(0);
  const [eventId, setEventId] = useState<number>(0);

  useEffect(() => {
    if (userIdInt) {
      const fetchProfile = async () => {
        try {
          const profileResponse = await fetch(
            `http://localhost:8000/accounts/profile/${userId}`
          );
          const profileData = await profileResponse.json();
          setUserDesignation(profileData.user_designation);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      };

      fetchProfile();

      const fetchTasks = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/tasks/tasks/?user_id=${userId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch task data");
          }

          const data = await response.json();
          setTasks(data);
          setLoading(false);
        } catch (error) {
          setError("Failed to load tasks.");
          setLoading(false);
        }
      };

      fetchTasks();
    } else {
      setError("User ID not provided.");
      setLoading(false);
    }
  }, [userIdInt]);

  const handleCreateTask = async () => {
    const newTask = {
      task_description: taskDescription,
      task_assignee: taskAssignee,
      event_id: eventId,
      task_status:"Pending",
      task_remarks: taskRemarks,
      task_deadline: taskDeadline,
    };

    try {
      const response = await fetch("http://localhost:8000/tasks/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setModalOpen(false);
        setTaskDescription("");
        setTaskRemarks("");
        setTaskDeadline("");
        setTaskAssignee(0);
        setEventId(0);
        alert("Task created successfully!");
      } else {
        alert("Unsuccessfull");
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_status: newStatus,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? { ...task, task_status: updatedTask.task_status } : task
          )
        );
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <Sidebar username="" email="" userId={userIdInt || 0} />
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        <Navbar />
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto mt-8">
          <h2 className="text-4xl font-semibold text-center mb-8 text-green-500">
            Your Tasks
          </h2>

          {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-gray-800 p-6 rounded-lg w-1/3">
      <h3 className="text-2xl mb-4 text-white">Create Task</h3>

      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-500 rounded text-black"
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <input
        type="number"
        className="w-full p-2 mb-4 border border-gray-500 rounded text-black"
        placeholder="Task Assignee (User ID)"
        value={taskAssignee}
        onChange={(e) => setTaskAssignee(Number(e.target.value))}
      />
      <input
        type="number"
        className="w-full p-2 mb-4 border border-gray-500 rounded text-black"
        placeholder="Event ID"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value))}
      />
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-500 rounded text-black"
        placeholder="Task Remarks"
        value={taskRemarks}
        onChange={(e) => setTaskRemarks(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 mb-4 border border-gray-500 rounded text-black"
        value={taskDeadline}
        onChange={(e) => setTaskDeadline(e.target.value)}
      />

      <div className="flex justify-between">
        <button
          className="bg-gray-600 text-white py-2 px-4 rounded-full"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-full"
          onClick={handleCreateTask}
        >
          Create Task
        </button>
      </div>
    </div>
  </div>
)}


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task: any) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>

          {userDesignation === "Manager" && (
            <div className="mt-4 text-center">
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-full"
                onClick={() => setModalOpen(true)}
              >
                Create New Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
