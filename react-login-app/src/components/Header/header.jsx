import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../profile/qger-logo.jpg"; // Import the logo image
import useAuth from "../../hooks/use-auth";

function Header() {
  const navigate = useNavigate(); // Get the navigate function
  const { isAuthenticated, logout, getUserDetails } = useAuth(); // Destructure isAuthenticated and logout from useAuth
  const { role } = getUserDetails();

  const handleNavigateToDashboard = () => {
    if (role === 1 || role === 2) {
      navigate("/dashboard");
    } else if (role === 3) {
      navigate("/employeeDashboard");
    } else {
      navigate("/"); // Navigate to home or login page if role is not defined
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function
  };

  return (
    <header className="bg-red-800 text-white py-4 px-8 flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center"
        onClick={handleNavigateToDashboard}
      >
        <img src={logoImg} alt="Logo" className="rounded-full h-16 w-16 mr-4" />
        {/* Adjust height and width as needed */}
        <h1 className="text-xl font-bold">Qatar German Gasket Factory</h1>
      </Link>
      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4">
        <li className="hidden md:block">
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          {/* Conditionally render the logout button if authenticated */}
          {isAuthenticated() && (
            <li>
              <button 
                onClick={handleLogout} 
                className="bg-white text-red-800 py-2 px-4 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </li>
          )}
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
