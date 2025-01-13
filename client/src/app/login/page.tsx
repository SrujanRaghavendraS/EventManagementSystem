// app/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 

type Props = {};

const LoginPage = (props: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage('');
    setCountdown(0);
  
    try {
      const response = await fetch('http://localhost:8000/accounts/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (data.status === 200) {
        setAlertMessage('Authentication successful!');
        let count = 2;
        setCountdown(count);
  
        const interval = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count === 0) {
            clearInterval(interval);
  
            // Extract the user_id from the response
            const userId = data.user_data.user_id;
  
            // Redirect to the dashboard with user_id in the URL
            const urlWithUserId = `/dashboard?user_id=${userId}`;
            router.push(urlWithUserId);
          }
        }, 1000);
      } else {
        setAlertMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setAlertMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-500">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 p-3 w-full rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 p-3 w-full rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {alertMessage && (
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>{alertMessage}</p>
            {countdown > 0 && <p>Redirecting in {countdown} seconds...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;