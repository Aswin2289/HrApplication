import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/interceptor";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";
import UpdateModal from "./update-modal";
import useAuth from "../hooks/use-auth";

function EmployeeLeaveEligibility() {
  const location = useLocation();
  const { statusRender } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusEmployee, setStatusEmployee] = useState("1,2");
  const [qidExpireState, setQidExpireState] = useState(false);
  const [passportExpireState, setPassportExpireState] = useState(false);
  const [lisenceExpireState, setlisenceExpireState] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    onPremise: false, // Initially selected
    vacation: false, // Initially selected
  });
  const [expireFilters, setExpireFilters] = useState({
    qid: false,
    passport: false,
    license: false,
  });
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();
  useEffect(() => {
    if (statusRender === 1) {
      setStatusEmployee("1");
      setStatusFilters({ onPremise: true, vacation: false });
    } else if (statusRender === 2) {
      setStatusEmployee("2");
      setStatusFilters({ onPremise: false, vacation: true });
    } else if (statusRender === 3) {
      setQidExpireState(true);
      setExpireFilters({ qid: true, passport: false, license: false });
    } else if (statusRender === 4) {
      setPassportExpireState(true);
      setExpireFilters({ qid: false, passport: true, license: false });
    } else if (statusRender === 5) {
      setlisenceExpireState(true);
      setExpireFilters({ qid: false, passport: false, license: true });
    } else {
      setStatusEmployee("1,2");
      setStatusFilters({ onPremise: false, vacation: false });
    }
  }, [statusRender]);

  const handleSort = (columnName) => {
    // If clicking on the same column, toggle sorting order
    if (sortBy === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking on a different column, set new sorting column and reset sorting order to ascending
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };
  const {
    data: employees,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "employees",
      {
        page: currentPage,
        size: rowsPerPage,
        searchKeyword,
        statusEmployee,

        sortBy,
        sortOrder,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/leave/availability/list", {
          params: {
            page: currentPage,
            size: rowsPerPage,
            searchKeyword,
            status: statusEmployee,
            sortBy,
            sortOrder,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch employee data");
      }
    },
  });

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployeeId(null); // Reset selected employee ID when closing modal
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const toggleSearch = () => {
    setSearchKeyword(""); // Reset searchKeyword to empty string
    setSearchOpen(!searchOpen); // Toggle searchOpen state
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(0);
  };
  const getStatusClass = (assigned) => {
    switch (assigned) {
      case true:
        return "bg-green-500 text-white";
      case false:
        return "bg-red-500 text-white";
      default:
        return "";
    }
  };
  return (
    <div className="container mx-auto mt-8">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <h2 className="text-2xl font-bold mb-4">Employee Annual Leave List</h2>

      <div className="flex justify-end gap-5 mr-8">
        <div>
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            id="search"
            onClick={toggleSearch} // Toggle search bar visibility on click
            className="cursor-pointer"
          >
            <path d="M46.599 40.236L36.054 29.691C37.89 26.718 39 23.25 39 19.5 39 8.73 30.27 0 19.5 0S0 8.73 0 19.5 8.73 39 19.5 39c3.75 0 7.218-1.11 10.188-2.943l10.548 10.545a4.501 4.501 0 0 0 6.363-6.366zM19.5 33C12.045 33 6 26.955 6 19.5S12.045 6 19.5 6 33 12.045 33 19.5 26.955 33 19.5 33z"></path>
          </svg>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="flex justify-end gap-5 mr-8 mt-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-2 py-1 w-52" // Reduced width of the search bar
          />
          {/* Close Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="cursor-pointer mt-1"
            onClick={toggleSearch} // Toggle search bar visibility on click
          >
            <path
              fill="currentColor"
              d="M19.71 19.71c-.39.39-1.02.39-1.41 0L12 13.41l-6.29 6.3c-.39.39-1.02.39-1.41 0s-.39-1.02 0-1.41L10.59 12 4.3 5.71c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0L12 10.59l6.29-6.3c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41L13.41 12l6.3 6.29c.39.39.39 1.03 0 1.42z"
            ></path>
          </svg>
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          {employees && employees.items.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="items-center">
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      onClick={() => handleSort("employeeId")}
                    >
                      <div className="flex items-center cursor-pointer">
                        Employee ID
                        {sortBy === "employeeId" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                          >
                            <path
                              fill="currentColor"
                              d={
                                sortOrder === "asc"
                                  ? "M7 14l5-5 5 5H7z"
                                  : "M7 10l5 5 5-5H7z"
                              }
                            />
                          </svg>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center cursor-pointer">
                        Name
                        {sortBy === "name" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                          >
                            <path
                              fill="currentColor"
                              d={
                                sortOrder === "asc"
                                  ? "M7 14l5-5 5 5H7z"
                                  : "M7 10l5 5 5-5H7z"
                              }
                            />
                          </svg>
                        )}
                      </div>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} onClick={() => handleSort("passportExpire")}>
                      <div className="flex items-center cursor-pointer">
                        Passport Expire
                        {sortBy === "passportExpire" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                          >
                            <path
                              fill="currentColor"
                              d={
                                sortOrder === "asc"
                                  ? "M7 14l5-5 5 5H7z"
                                  : "M7 10l5 5 5-5H7z"
                              }
                            />
                          </svg>
                        )}
                      </div>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Eligible On
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.items.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell className="items-center">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell className="items-center">
                        {employee.name}
                      </TableCell>
                      {/* <TableCell className="items-center">
                        {employee.eligibilityResponseDTOS.eligibilityDate}
                      </TableCell> */}
                       <TableCell className="items-center">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ flex: 0 }}>
                            {new Date(
                              employee.passportExpire[0],
                              employee.passportExpire[1] - 1,
                              employee.passportExpire[2]
                            ).toLocaleDateString()}
                          </div>
                          <div
                            className="text-red-700"
                            style={{ marginLeft: "5px" }}
                          > (
                            <span className="font-bold">
                              {employee.noOfDaysPassportExpire}
                            </span>
                            ) days
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="items-center">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ flex: 0 }}>
                            {new Date(
                              employee.eligibilityResponseDTOS.eligibilityDate[0],
                              employee.eligibilityResponseDTOS
                                .eligibilityDate[1] - 1,
                              employee.eligibilityResponseDTOS.eligibilityDate[2]
                            ).toLocaleDateString()}
                          </div>
                          <div
                            className="text-red-700"
                            style={{ marginLeft: "5px" }}
                          >
                            (
                            <span className="font-bold">
                              {employee.eligibilityResponseDTOS.daysLeft}
                            </span>
                            ) days
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="items-center">
                      <span
                        className={`rounded-full px-4 py-1 ${getStatusClass(
                            employee.eligibilityResponseDTOS.eligible
                        )}`}
                      >
                        {employee.eligibilityResponseDTOS.eligible
                          ? "Is Eligible"
                          : "Not Eligible"}
                          </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div>No results found.</div>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={employees.totalItems}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
      <UpdateModal
        show={showModal}
        handleClose={handleCloseModal}
        employeeId={selectedEmployeeId}
      />
    </div>
  );
}
export default EmployeeLeaveEligibility;
