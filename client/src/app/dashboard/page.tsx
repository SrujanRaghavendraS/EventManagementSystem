'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../(Components)/Navbar';
import Sidebar from '../(Components)/Sidebar';
import LoadingSpinner from '../(Components)/LoadingSpinner'; // Importing the LoadingSpinner component

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id'); // Get the user_id from the URL
  const [userData, setUserData] = useState({ user_id: '', user_name: '', user_email: '' });
  const [kpiData, setKpiData] = useState({ events_count: 0, completed_events_count: 0, tasks_count: 0 });

  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8000/accounts/profile/${userId}`);
          const data = await response.json();
          setUserData({
            user_id: userId,
            user_name: data.user_name || 'No Name', // Get user name from API
            user_email: data.user_email || 'No Email',
          });
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      const fetchKpiData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/kpi/get_events?user_id=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch KPI data');
          }
          const data = await response.json();
          setKpiData({
            events_count: data.events_count || 0,
            completed_events_count: data.total_events_count || 0,
            tasks_count: data.tasks_count || 0,
          });
        } catch (error) {
          console.error('Error fetching KPI data:', error);
        }
      };

      const fetchTasksData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/tasks/tasks?user_id=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch tasks data');
          }
          const tasks = await response.json();
          const filteredTasks = tasks.filter(
            (task) => task.task_status === 'In Progress' || task.task_status === 'Pending'
          );
          setKpiData((prevData) => ({
            ...prevData,
            tasks_count: filteredTasks.length,
          }));
        } catch (error) {
          console.error('Error fetching tasks data:', error);
        }
      };

      fetchUserDetails();
      fetchKpiData();
      fetchTasksData();
    }
  }, [userId]);

  // Handle loading state
  if (!userId || !userData.user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner /> {/* Display the spinner during loading */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar userId={parseInt(userData.user_id, 10)} />

      {/* Main Content */}
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        <Navbar />
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-green-500">
            Welcome {userData.user_name}
          </h2>

          {/* KPIs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
              <p className="text-xl font-semibold text-green-500">Total Events Participated</p>
              <p className="text-2xl font-bold text-white">{kpiData.completed_events_count}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
              <p className="text-xl font-semibold text-green-500">Ongoing Events</p>
              <p className="text-2xl font-bold text-white">{kpiData.events_count}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
              <p className="text-xl font-semibold text-green-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-white">{kpiData.tasks_count}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
