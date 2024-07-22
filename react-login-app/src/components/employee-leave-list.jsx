import React, { useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";

function EmployeeLeaveList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: leaveEmployees,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "leaveEmployees",
      { page: currentPage, size: rowsPerPage, searchKeyword },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/leaveDetails", {
          params: { page: currentPage, size: rowsPerPage, searchKeyword },
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch employee leave data");
      }
    },
  });

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
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
    refetch();
  };
  

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <h2 className="text-2xl font-bold mb-4">Employee Leave List</h2>

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
          {leaveEmployees && leaveEmployees.items.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="items-center">
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Employee ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Casual Leave Taken
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Casual Leave Balance
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Sick Leave Taken
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Sick Leave Balance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {leaveEmployees.items.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>
                        {employee.employeeId}
                      </TableCell>
                      <TableCell >
                        {employee.name}
                      </TableCell>
                      <TableCell align="center">
                        {employee.casualLeaveTaken}
                      </TableCell>
                      <TableCell align="center">
                        {employee.casualLeaveBalance}
                      </TableCell>
                      <TableCell align="center">
                        {employee.sickLeaveTaken}
                      </TableCell>
                      <TableCell align="center">
                        {employee.sickLeaveBalance}
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
            count={leaveEmployees.totalItems}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </div>
  );
}

export default EmployeeLeaveList;
