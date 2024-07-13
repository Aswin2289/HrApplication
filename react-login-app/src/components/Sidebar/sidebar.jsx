import React, { useState, useRef, useEffect } from "react";
import userProfileImage from "../../profile/john_doe.jpg"; // import user profile image
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/use-auth";
import Footer from "../Footer/footer";
function Sidebar() {
  const { getUserDetails } = useAuth();
  // Example user name
  // const userName = "John Doe";
  const { username, id, role } = getUserDetails();
  const sidebarRef = useRef(null);
  // State to manage the dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownLeaveOpen, setDropdownLeaveOpen] = useState(false);
  const [dropdownDocumentOpen, setDropdownDocumentOpen] = useState(false);
  const [dropdownVehicleOpen, setDropdownVehicleOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDropdownLeave = () => {
    setDropdownLeaveOpen(!dropdownLeaveOpen);
  };
  const toggleDropdownDocument = () => {
    setDropdownDocumentOpen(!dropdownDocumentOpen);
  };
  const toggleVehicleDocument = () => {
    setDropdownVehicleOpen(!dropdownVehicleOpen);
  };
  useEffect(() => {
    const setSidebarHeight = () => {
      const height = sidebarRef.current.scrollHeight;
      sidebarRef.current.style.height = `calc(100% - ${height}px)`;
    };
    setSidebarHeight();
    window.addEventListener("resize", setSidebarHeight);
    return () => {
      window.removeEventListener("resize", setSidebarHeight);
    };
  }, []);

  return (
    <div className="h-screen text-gray-600 w-96" ref={sidebarRef}>
      <div
        className="h-screen flex flex-col bg-red-400 bg-opacity-25 rounded-lg"
        ref={sidebarRef}
      >
        <div className="flex-grow p-4 ">
          <div
            className="flex items-center mb-4 bg-gray-600 bg-opacity-25 rounded-lg p-4 cursor-pointer"
            // onClick={toggleDropdown}
          >
            <img
              src={userProfileImage}
              alt="User Profile"
              className="rounded-full h-12 w-12 mr-4"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-600">
                {username}
              </span>
              <div className="flex gap-3">
                <span className="text-sm text-gray-600">
                  {role === 1
                    ? "Admin"
                    : role === 2
                    ? "HR"
                    : role === 3
                    ? "Employee"
                    : role === 4
                    ? "HOD"
                    : "NaN"}
                </span>

                <span className="text-sm text-gray-500">ID: {id}</span>
              </div>
            </div>
          </div>
          {role === 2 && (
            <React.Fragment>
              <div
                className="flex items-center mb-3 cursor-pointer mt-10"
                onClick={toggleDropdown}
              >
                {/* SVG icon for Employee Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 36 36"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Employee Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addEmployee"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Add Employee
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/listEmployee"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      List Employee
                    </NavLink>
                  </li>
                  {/* <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/dashboard"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Employee Summary
                    </NavLink>
                  </li> */}
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownLeave}
              >
                {/* SVG icon for Leave Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 2048 2048"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2048 1536v128h-646l211 211l-90 90l-365-365l365-365l90 90l-211 211zm-756-433l-88 93q-89-84-201-128t-235-44q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 137-63 248t-177 186q70 26 133 66t119 91M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Leave Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownLeaveOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownLeaveOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addLeave"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Leave Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/rejectedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Rejected Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/approvedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Approved Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingAllEmployeeLeave"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      All Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/employeeLeaveList"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Employee Leave List
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownDocument}
              >
                {/* SVG icon for Document Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M15.75 13a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75m0 4a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7 2.25A2.75 2.75 0 0 0 4.25 5v14A2.75 2.75 0 0 0 7 21.75h10A2.75 2.75 0 0 0 19.75 19V7.968c0-.381-.124-.751-.354-1.055l-2.998-3.968a1.75 1.75 0 0 0-1.396-.695zM5.75 5c0-.69.56-1.25 1.25-1.25h7.25v4.397c0 .414.336.75.75.75h3.25V19c0 .69-.56 1.25-1.25 1.25H7c-.69 0-1.25-.56-1.25-1.25z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Document Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownDocumentOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownDocumentOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pdfview"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      View Document
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-2 cursor-pointer"
                onClick={toggleVehicleDocument}
              >
                {/* SVG icon for Vehicle Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M0 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h-2V5H2v7h6v2H2v4h6v2H5.414L3.5 21.914L2.086 20.5l.5-.5H2a2 2 0 0 1-2-2zm11.323 3h10.354L24 13.807V21.5h-2V20H11v1.5H9v-7.693zM11 18h11v-3.807L21.923 14H11.077l-.077.193zm.877-6h9.246l-.8-2h-7.646zM3 15h2.004v2.004H3zm9 0h2.004v2.004H12zm7 0h2.004v2.004H19z"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Vehicle Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownVehicleOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownVehicleOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addVehicle"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Add Vehicle
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/listVehicle"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      List Vehicle
                    </NavLink>
                  </li>
                </ul>
              )}
            </React.Fragment>
          )}
          {role === 4 && (
            <React.Fragment>
              <div
                className="flex items-center mb-3 cursor-pointer mt-10"
                onClick={toggleDropdown}
              >
                {/* SVG icon for Employee Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 36 36"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Employee Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/listEmployee"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      List Employee
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownLeave}
              >
                {/* SVG icon for Leave Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 2048 2048"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2048 1536v128h-646l211 211l-90 90l-365-365l365-365l90 90l-211 211zm-756-433l-88 93q-89-84-201-128t-235-44q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 137-63 248t-177 186q70 26 133 66t119 91M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Leave Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownLeaveOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownLeaveOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addLeave"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Leave Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/rejectedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Rejected Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/approvedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Approved Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/allpendingrequesthod"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      All Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/employeeLeaveList"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Employee Leave List
                    </NavLink>
                  </li>
                </ul>
              )}

              <div
                className="flex items-center mb-2 cursor-pointer"
                onClick={toggleVehicleDocument}
              >
                {/* SVG icon for Vehicle Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M0 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h-2V5H2v7h6v2H2v4h6v2H5.414L3.5 21.914L2.086 20.5l.5-.5H2a2 2 0 0 1-2-2zm11.323 3h10.354L24 13.807V21.5h-2V20H11v1.5H9v-7.693zM11 18h11v-3.807L21.923 14H11.077l-.077.193zm.877-6h9.246l-.8-2h-7.646zM3 15h2.004v2.004H3zm9 0h2.004v2.004H12zm7 0h2.004v2.004H19z"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Vehicle Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownVehicleOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownVehicleOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">Add vehicle</li>
                  <li className="py-2 cursor-pointer">List vehicle</li>
                </ul>
              )}
            </React.Fragment>
          )}
          {role === 3 && (
            <React.Fragment>
              <div
                className="flex items-center mb-3 cursor-pointer mt-10"
                onClick={toggleDropdown}
              >
                {/* SVG icon for Employee Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 36 36"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Profile Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      View Profile
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Change Password
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownLeave}
              >
                {/* SVG icon for Leave Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 2048 2048"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2048 1536v128h-646l211 211l-90 90l-365-365l365-365l90 90l-211 211zm-756-433l-88 93q-89-84-201-128t-235-44q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 137-63 248t-177 186q70 26 133 66t119 91M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Leave Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownLeaveOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownLeaveOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addLeave"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Leave Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/rejectedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Rejected Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/approvedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Approved Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingApplication"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Pending Application
                    </NavLink>
                  </li>
                </ul>
              )}
            </React.Fragment>
          )}
          {role === 1 && (
            <React.Fragment>
              <div
                className="flex items-center mb-3 cursor-pointer mt-10"
                onClick={toggleDropdown}
              >
                {/* SVG icon for Employee Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 36 36"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M18.42 16.31a5.7 5.7 0 1 1 5.76-5.7a5.74 5.74 0 0 1-5.76 5.7m0-9.4a3.7 3.7 0 1 0 3.76 3.7a3.74 3.74 0 0 0-3.76-3.7m3.49 10.74a20.6 20.6 0 0 0-13 2a1.77 1.77 0 0 0-.91 1.6v3.56a1 1 0 0 0 2 0v-3.43a18.92 18.92 0 0 1 12-1.68Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M33 22h-6.7v-1.48a1 1 0 0 0-2 0V22H17a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1m-1 10H18v-8h6.3v.41a1 1 0 0 0 2 0V24H32Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M21.81 27.42h5.96v1.4h-5.96zM10.84 12.24a18 18 0 0 0-7.95 2A1.67 1.67 0 0 0 2 15.71v3.1a1 1 0 0 0 2 0v-2.9a16 16 0 0 1 7.58-1.67a7.28 7.28 0 0 1-.74-2m22.27 1.99a17.8 17.8 0 0 0-7.12-2a7.46 7.46 0 0 1-.73 2A15.89 15.89 0 0 1 32 15.91v2.9a1 1 0 1 0 2 0v-3.1a1.67 1.67 0 0 0-.89-1.48m-22.45-3.62v-.67a3.07 3.07 0 0 1 .54-6.11a3.15 3.15 0 0 1 2.2.89a8.16 8.16 0 0 1 1.7-1.08a5.13 5.13 0 0 0-9 3.27a5.1 5.1 0 0 0 4.7 5a7.42 7.42 0 0 1-.14-1.3m14.11-8.78a5.17 5.17 0 0 0-3.69 1.55a7.87 7.87 0 0 1 1.9 1a3.14 3.14 0 0 1 4.93 2.52a3.09 3.09 0 0 1-1.79 2.77a7.14 7.14 0 0 1 .06.93a7.88 7.88 0 0 1-.1 1.2a5.1 5.1 0 0 0 3.83-4.9a5.12 5.12 0 0 0-5.14-5.07"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Employee Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addEmployee"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Add Employee
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/listEmployee"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      List Employee
                    </NavLink>
                  </li>
                  {/* <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/dashboard"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Employee Summary
                    </NavLink>
                  </li> */}
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownLeave}
              >
                {/* SVG icon for Leave Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 2048 2048"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2048 1536v128h-646l211 211l-90 90l-365-365l365-365l90 90l-211 211zm-756-433l-88 93q-89-84-201-128t-235-44q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 137-63 248t-177 186q70 26 133 66t119 91M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Leave Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownLeaveOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownLeaveOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addLeave"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Leave Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pendingLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/rejectedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Rejected Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/approvedLeaves"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      My Approved Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/allPendingLeaveRequest"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      All Pending Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/allAcceptedLeaveRequest"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      All Accepted Request
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/employeeLeaveList"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Employee Leave List
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-3 cursor-pointer"
                onClick={toggleDropdownDocument}
              >
                {/* SVG icon for Document Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M15.75 13a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75m0 4a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7 2.25A2.75 2.75 0 0 0 4.25 5v14A2.75 2.75 0 0 0 7 21.75h10A2.75 2.75 0 0 0 19.75 19V7.968c0-.381-.124-.751-.354-1.055l-2.998-3.968a1.75 1.75 0 0 0-1.396-.695zM5.75 5c0-.69.56-1.25 1.25-1.25h7.25v4.397c0 .414.336.75.75.75h3.25V19c0 .69-.56 1.25-1.25 1.25H7c-.69 0-1.25-.56-1.25-1.25z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Document Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownDocumentOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownDocumentOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/pdfview"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      View Document
                    </NavLink>
                  </li>
                </ul>
              )}
              <div
                className="flex items-center mb-2 cursor-pointer"
                onClick={toggleVehicleDocument}
              >
                {/* SVG icon for Vehicle Management */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M0 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h-2V5H2v7h6v2H2v4h6v2H5.414L3.5 21.914L2.086 20.5l.5-.5H2a2 2 0 0 1-2-2zm11.323 3h10.354L24 13.807V21.5h-2V20H11v1.5H9v-7.693zM11 18h11v-3.807L21.923 14H11.077l-.077.193zm.877-6h9.246l-.8-2h-7.646zM3 15h2.004v2.004H3zm9 0h2.004v2.004H12zm7 0h2.004v2.004H19z"
                  />
                </svg>
                <span className="pl-2 md:pr-4 lg:pr-8 font-semibold mb-1">
                  Vehicle Management
                </span>
                {/* Dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ml-auto transition-transform transform ${
                    dropdownVehicleOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  fillRule="evenodd"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {/* Conditional rendering of the dropdown menu */}
              {dropdownVehicleOpen && (
                <ul className="list-disc pl-5">
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/addVehicle"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      Add Vehicle
                    </NavLink>
                  </li>
                  <li className="py-2 cursor-pointer">
                    <NavLink
                      to="/listVehicle"
                      activeclassname="bg-gray-600 bg-opacity-25"
                      className="block pl-2 rounded-lg"
                    >
                      List Vehicle
                    </NavLink>
                  </li>
                </ul>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
export default Sidebar;