// NotFound.js

import React from 'react';
import './NotFound.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/use-auth'

const NotFound = () => {

  const navigate = useNavigate();
  const { isAuthenticated,getUserDetails } = useAuth(); // Assuming isAuthenticated is obtained from your use-auth hook

  const goToHomePage = () => {
    const authenticated = isAuthenticated(); // Check if the user is authenticated
    if (authenticated) {
      const { role } = getUserDetails(); // Get the role from user details
      if (role === 2) {
        navigate('/dashboard'); // Navigate to dashboard if role is 2
      } else if (role === 3) {
        navigate('/employeeDashboard'); // Navigate to employeeDashboard if role is 3
      }else if (role === 1) {
        navigate('/dashboardAdmin'); // Navigate to admin dashboard if role is 1
      }else if (role === 4) {
        navigate('/hodDashboard'); // Navigate to admin dashboard if role is 1
      }
      else{
        navigate('/login'); // Navigate to login if user is not authenticated
      }
    } else {
      navigate('/login'); // Navigate to login if user is not authenticated
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="404" className="w-auto h-80 image-404 " /> {/* Apply the animation class here */}
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-10">Sorry, the page you're looking for does not exist.</p>

      <button className='bg-red-700 text-white rounded px-4 py-2 hover:bg-green-700  ' onClick={goToHomePage}>Go to HomePage</button>

    </div>
  );
}

export default NotFound;
