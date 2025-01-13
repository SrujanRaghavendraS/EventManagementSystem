"use client";
import React, { useState, useEffect } from "react";

const TaskTrackerModal = ({ event, onClose }: { event: any; onClose: () => void }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 4;
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/tasks/tasks?event_id=${event.event_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [event.event_id]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const saveTasks = async () => {
    setSaving(true);
    try {
      for (const task of tasks) {
        const response = await fetch(`http://localhost:8000/tasks/tasks/update_by_organiser/${task.task_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_description: task.task_description,
            task_assignee: task.task_assignee,
            task_status: task.task_status,
            task_remarks: task.task_remarks,
            task_deadline: task.task_deadline,
            event_id: task.event_id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update task ${task.task_id}: ${response.statusText}`);
        }
      }
      alert("All tasks updated successfully!");
    } catch (err: any) {
      alert(`Error while saving tasks: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = tasks.slice(startIndex, endIndex);

  // Count tasks by status
  const taskCounts = {
    Pending: tasks.filter(task => task.task_status === "Pending").length,
    "In Progress": tasks.filter(task => task.task_status === "In Progress").length,
    Completed: tasks.filter(task => task.task_status === "Completed").length,
  };

  const totalTasks = tasks.length;

  // Calculate percentage for each status
  const getProgressPercentage = (count: number) => (totalTasks === 0 ? 0 : (count / totalTasks) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full h-[500px] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Task Status</h3>
          <div className="flex space-x-4">
            <button
              onClick={saveTasks}
              disabled={saving}
              className={`py-2 px-4 rounded transition ${saving ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-400 text-white"}`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition"
            >
              Close
            </button>
            <button
              onClick={() => setShowProgressModal(true)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition"
            >
              Show Progress
            </button>
          </div>
        </div>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="overflow-auto h-3/4">
              <table className="min-w-full bg-gray-200 border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Task ID</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-left">Assignee</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-left">Remarks</th>
                    <th className="border border-gray-300 p-2 text-left">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task, index) => (
                    <tr key={task.task_id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{task.task_id}</td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={task.task_description}
                          onChange={(e) => handleInputChange(startIndex + index, "task_description", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">{task.task_assignee}</td>
                      <td className="border border-gray-300 p-2">
                        <select
                          value={task.task_status}
                          onChange={(e) => handleInputChange(startIndex + index, "task_status", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={task.task_remarks || ""}
                          onChange={(e) => handleInputChange(startIndex + index, "task_remarks", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="date"
                          value={task.task_deadline}
                          onChange={(e) => handleInputChange(startIndex + index, "task_deadline", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`py-1 px-3 rounded border ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`py-1 px-3 rounded border ml-2 ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                >
                  Next
                </button>
              </div>
              <div>
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">Task Progress</h3>

            {["Pending", "In Progress", "Completed"].map((status) => (
              <div key={status} className="mb-4">
                <p className="text-sm">{status}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    style={{ width: `${getProgressPercentage(taskCounts[status])}%` }}
                    className={`h-2.5 rounded-full ${status === "Completed" ? "bg-green-500" : status === "In Progress" ? "bg-yellow-500" : "bg-red-500"}`}
                  ></div>
                </div>
                <div className="text-sm mt-1">{taskCounts[status]} of {totalTasks} tasks</div>
              </div>
            ))}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowProgressModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition"
              >
                Close Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTrackerModal;
