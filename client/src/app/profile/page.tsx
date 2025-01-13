'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/(Components)/Navbar'; // Import Navbar component
import Sidebar from '@/app/(Components)/Sidebar'; // Import Sidebar component

const ProfilePage = () => {
  const searchParams = useSearchParams();

  // Retrieve the user_id from the query parameters
  const user_id = searchParams.get('user_id');

  // Set up state to hold user profile data
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from API on component mount
  useEffect(() => {
    if (user_id) {
      // API request to fetch profile data
      fetch(`http://localhost:8000/accounts/profile/${user_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
          return response.json();
        })
        .then((data) => {
          setProfileData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load profile data.');
          setLoading(false);
        });
    } else {
      setError('User ID not provided.');
      setLoading(false);
    }
  }, [user_id]);

  // Custom loading spinner
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid h-16 w-16"></div>
    </div>
  );

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar 
        username={profileData?.user_name || 'User'} 
        email={profileData?.user_email || ''} 
        userId={profileData?.user_id || 0} 
      />

      {/* Main Content */}
      <div className="ml-20 sm:ml-20 lg:ml-64 w-full p-8">
        {/* Navbar */}
        <Navbar />

        {/* Profile Content */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto mt-8">
          <h2 className="text-4xl font-semibold text-center mb-8 text-green-500">
             {profileData?.user_name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                <strong className="font-semibold text-gray-400">User ID:</strong> {profileData?.user_id}
              </p>
              <p>
                <strong className="font-semibold text-gray-400">Email:</strong> {profileData?.user_email}
              </p>
              <p>
                <strong className="font-semibold text-gray-400">Username:</strong> {profileData?.user_name}
              </p>
              <p>
                <strong className="font-semibold text-gray-400">Designation:</strong> {profileData?.user_designation}
              </p>
            </div>

            <div className="space-y-4 text-lg text-gray-300">
              <p>
                <strong className="font-semibold text-gray-400">Gender:</strong> {profileData?.user_gender}
              </p>
              <p>
                <strong className="font-semibold text-gray-400">Phone Number:</strong> {profileData?.user_phone_number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
