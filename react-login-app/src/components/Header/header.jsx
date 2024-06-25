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
    <div className="bg-red-800 text-white py-4 px-8 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center"
        onClick={handleNavigateToDashboard}
      >
        <img src={logoImg} alt="Logo" className="rounded-full h-16 w-16 mr-5" />
        {/* Adjust height and width as needed */}
        <h1 className="text-xl font-bold">Qatar German Gasket Factory</h1>
      </Link>
      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          {/* Conditionally render the logout button if authenticated */}
          {isAuthenticated() && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
