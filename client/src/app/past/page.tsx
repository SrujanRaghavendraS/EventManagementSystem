"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/app/(Components)/Navbar";
import Sidebar from "@/app/(Components)/Sidebar";
import { useSearchParams } from "next/navigation";

const PostTasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const userIdInt = userId ? parseInt(userId, 10) : null;

  // Fetch tasks from the API
  useEffect(() => {
    fetch(`http://localhost:8000/past/events-completed`)
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

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <div className="loader border-t-4 border-green-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar and Navbar inheritance */}
      <Sidebar username="" email="" userId={userIdInt || 0} />
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        <Navbar />

        {/* Page Content */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto mt-8">
        <h2 className="text-4xl font-semibold text-green-500 mb-8 text-center">
  Past Events
</h2>


          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col"
                >
                  {/* Highlight event_name in green as h3 */}
                  {task.event_name && (
                    <h3 className="text-green-400 font-bold text-lg mb-4">
                      {task.event_name}
                    </h3>
                  )}

                  {/* Dynamically display other task properties */}
                  {Object.entries(task).map(([key, value], idx) => {
                    if (key === "event_name") return null; // Skip event_name here

                    return (
                      <p
                        key={idx}
                        className={`${
                          key === "task_description"
                            ? "text-green-400 font-bold"
                            : "text-gray-300"
                        } mb-2`}
                      >
                        {key.replace(/_/g, " ")}: {value}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300 text-xl">
              No data to show.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostTasksPage;
