import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../profile/qger-logo.jpg"; // Import the logo image
import useAuth from "../../hooks/use-auth";
import NotificationsIcon from "@mui/icons-material/Notifications"; // Notification icon
import Badge from "@mui/material/Badge"; // Badge to display notification count
import useLeaveNotification from "../../hooks/use-leave-notification";

function Header() {
  const navigate = useNavigate(); // Get the navigate function
  const { isAuthenticated, logout, getUserDetails } = useAuth(); // Destructure isAuthenticated and logout from useAuth
  const { role } = getUserDetails();
  const { getLeaveNotification } = useLeaveNotification();

  const [notificationCount, setNotificationCount] = useState(0); // Initialize with 0

  // Fetch the notification count on component mount
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const count = await getLeaveNotification(); // Fetch notification count from API
        setNotificationCount(count); // Update the state with the response data
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, [getLeaveNotification]); // Empty dependency array to run only once on mount

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

  const handleNotificationClick = () => {
    if (role === 1) {
      navigate("/allPendingLeaveRequest");
    }else if(role===2){
      navigate("/pendingAllEmployeeLeave");
    }else if(role===4){
      navigate("/allpendingrequesthod");
    }else{
      navigate("/");
    }
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
        <h1 className="text-xl font-bold">Qatar German Gasket Factory</h1>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-4 items-center gap-3">
          <li className="hidden md:block">
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>

          {/* Notification Icon with Badge */}
          <li>
            {role !== 3 && role !== 5 && (
              <Badge
                badgeContent={notificationCount}
                color="success"
                overlap="rectangular"
              >
                <NotificationsIcon
                  className="text-white cursor-pointer"
                  onClick={handleNotificationClick}
                  style={{ fontSize: "28px" }} // Adjust size if necessary
                />
              </Badge>
            )}
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
        </ul>
      </nav>
    </header>
  );
}

export default Header;
