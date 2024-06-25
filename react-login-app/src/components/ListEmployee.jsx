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
import useDeleteEmployee from "../hooks/useDeleteEmployee";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";

function ListEmployee() {
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
  const [statusFilters, setStatusFilters] = useState({
    onPremise: false, // Initially selected
    vacation: false, // Initially selected
  });
  const [expireFilters, setExpireFilters] = useState({
    qid: false,
    passport: false,
    license: false,
  });

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
  const {
    deleteEmployee,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteEmployee(); // Destructure the hook
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
        qidExpireState,
        passportExpireState,
        lisenceExpireState,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/employees", {
          params: {
            page: currentPage,
            size: rowsPerPage,
            searchKeyword,
            status: statusEmployee,
            qidExpiresThisMonth: qidExpireState,
            passportExpired: passportExpireState,
            licenseExpired: lisenceExpireState,
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

  const [showSpinner, setShowSpinner] = useState(false);

  const handleDeleteClick = async (employeeId) => {
    setShowSpinner(true);
    try {
      await deleteEmployee(employeeId);
      toast.success("Employee deleted successfully");
      setShowSpinner(false);
      refetch();
    } catch (error) {
      toast.error("Error deleting employee");
      console.error("Error deleting employee:", error);
    }
  };
  const handleDetailClick = (employeeId) => {
    console.log("employeeId", employeeId);
    navigate("/employeeDetail", { state: { employeeId } });
  };

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
  };
  const toggleFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusCheckboxChange = (filterType) => (event) => {
    let updatedFilters = {
      ...statusFilters,
      [filterType]: event.target.checked,
    };
    let updatedStatus = "";

    // Update the status value based on the checkbox selection
    switch (filterType) {
      case "onPremise":
        updatedFilters.vacation =
          !updatedFilters.onPremise && updatedFilters.vacation; // Deselect vacation if onPremise is selected
        updatedStatus = updatedFilters.onPremise
          ? "1"
          : updatedFilters.vacation
          ? "2"
          : "";
        break;
      case "vacation":
        updatedFilters.onPremise =
          !updatedFilters.vacation && updatedFilters.onPremise; // Deselect onPremise if vacation is selected
        updatedStatus = updatedFilters.vacation
          ? "2"
          : updatedFilters.onPremise
          ? "1"
          : "";
        break;
      default:
        break;
    }

    setStatusFilters(updatedFilters);
    setStatusEmployee(updatedStatus);
  };

  const handleExpireCheckboxChange = (filterType) => (event) => {
    const isChecked = event.target.checked;
    const updatedFilters = { qid: false, passport: false, license: false };

    setExpireFilters({ ...updatedFilters, [filterType]: isChecked });
    setQidExpireState(filterType === "qid" && isChecked);
    setPassportExpireState(filterType === "passport" && isChecked);
    setlisenceExpireState(filterType === "license" && isChecked);
  };

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>

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
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="24"
            height="24"
            id="filter"
            onClick={toggleFilter}
            className="cursor-pointer"
          >
            <path d="M2 7h.142a3.981 3.981 0 0 0 7.716 0H30a1 1 0 0 0 0-2H9.858a3.981 3.981 0 0 0-7.716 0H2a1 1 0 0 0 0 2zm4-3a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm24 11h-.142a3.981 3.981 0 0 0-7.716 0H2a1 1 0 0 0 0 2h20.142a3.981 3.981 0 0 0 7.716 0H30a1 1 0 0 0 0-2zm-4 3a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm4 7H19.858a3.981 3.981 0 0 0-7.716 0H2a1 1 0 0 0 0 2h10.142a3.981 3.981 0 0 0 7.716 0H30a1 1 0 0 0 0-2zm-14 3a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path>
          </svg>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>
              <p className="font-thin text-sm">Status</p>
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={statusFilters.onPremise}
                onChange={handleStatusCheckboxChange("onPremise")}
              />
              OnPremis
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={statusFilters.vacation}
                onChange={handleStatusCheckboxChange("vacation")}
              />
              Vacation 
            </MenuItem>
            <MenuItem>
              <p className="text-sm">Expire details</p>
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={expireFilters.qid}
                onChange={handleExpireCheckboxChange("qid")}
              />
              QID Expire
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={expireFilters.passport}
                onChange={handleExpireCheckboxChange("passport")}
              />
              Passport Expire
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={expireFilters.license}
                onChange={handleExpireCheckboxChange("license")}
              />
              License Expire
            </MenuItem>
          </Menu>
        </div>
        <div>
          {/* Download Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="24"
            height="24"
            id="download"
          >
            <g>
              <g>
                <rect width="16" height="2" x="4" y="18" rx="1" ry="1"></rect>
                <rect
                  width="4"
                  height="2"
                  x="3"
                  y="17"
                  rx="1"
                  ry="1"
                  transform="rotate(-90 5 18)"
                ></rect>
                <rect
                  width="4"
                  height="2"
                  x="17"
                  y="17"
                  rx="1"
                  ry="1"
                  transform="rotate(-90 19 18)"
                ></rect>
                <path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"></path>
                <path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"></path>
              </g>
            </g>
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
                    <TableCell sx={{ fontWeight: "bold" }} onClick={() => handleSort("employeeId")}>
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
                    <TableCell sx={{ fontWeight: "bold" }} onClick={() => handleSort("name")}>
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
                    <TableCell sx={{ fontWeight: "bold" }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} onClick={() => handleSort("qidExpire")}>
                      <div className="flex items-center cursor-pointer">
                        QID Expire
                        {sortBy === "qidExpire" && (
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
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                      <TableCell className="items-center">
                        {employee.jobTitle}
                      </TableCell>
                      <TableCell className="items-center">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ flex: 0 }}>
                            {new Date(
                              employee.qidExpire[0],
                              employee.qidExpire[1] - 1,
                              employee.qidExpire[2]
                            ).toLocaleDateString()}
                          </div>
                          <div
                            className="text-red-700"
                            style={{ marginLeft: "5px" }}
                          >
                            (
                            <span className="font-bold">
                              {employee.noOfDaysQidExpire}
                            </span>
                            ) days
                          </div>
                        </div>
                      </TableCell>
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
                          >
                            (
                            <span className="font-bold">
                              {employee.noOfDaysPassportExpire}
                            </span>
                            ) days
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="items-center">
                        <div className="flex gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            id="edit"
                          >
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            id="view"
                            onClick={() => handleDetailClick(employee.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <g>
                              <path d="M23.91 11.58C21.94 7.31 17.5 3 12 3S2.06 7.31.09 11.58a1.025 1.025 0 0 0 0 .84C2.06 16.69 6.5 21 12 21s9.94-4.31 11.91-8.58a1.025 1.025 0 0 0 0-.84ZM12 17a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </g>
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            id="delete"
                            onClick={() => handleDeleteClick(employee.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <path
                              fill="#000"
                              d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"
                            ></path>
                            <path
                              fill="#000"
                              fillRule="evenodd"
                              d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        {deleteLoading && <CircularProgress size={24} />}{" "}
                        {/* Render spinner when deleteLoading is true */}
                        {/* <Button variant="text" color="primary" onClick={() => handleDetailClick(employee.employeeId)}>
                          Detail
                        </Button> */}
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
    </div>
  );
}

export default ListEmployee;
