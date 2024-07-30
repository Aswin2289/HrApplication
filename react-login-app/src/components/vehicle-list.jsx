import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Checkbox,
  Menu,
  MenuItem,
  Modal,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/interceptor";
import useAddVehicle from "../hooks/use-add-vehicle";
import MyButton from "./Button/my-button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/use-auth";
const schema = z.object({
  // userId: z.string().min(1, "Document name is required"),
});
function VehicleList() {
  const location = useLocation();
  const { statusRender } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusVehicle, setStatusVehicle] = useState("0,1");
  const [statusFilters, setStatusFilters] = useState({
    active: false,
    inactive: false,
  });
  const [istimaraExpireState, setIstimaraExpireState] = useState(false);
  const [insuranceExpireState, setInsuranceExpireState] = useState(false);
  const [expireFilters, setExpireFilters] = useState({
    istimara: false,
    insurance: false,
  });
  const { deleteVehicle, assignVehicle ,removeAssignee} = useAddVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();
  // const [vehicleId, setVehicleId] = useState(null);
  console.log(employeeName);
  useEffect(() => {
    if (statusRender === "active") {
      setStatusVehicle("0");
      setStatusFilters({ active: true, inactive: false });
    } else if (statusRender === "inactive") {
      setStatusVehicle("1");
      setStatusFilters({ active: false, inactive: true });
    } else if (statusRender === 3) {
      setIstimaraExpireState(true);
      setExpireFilters({ istimara: true, insurance: false });
    } else if (statusRender === 4) {
      setInsuranceExpireState(true);
      setExpireFilters({ istimara: false, insurance: true });
    } else {
      setStatusFilters({ active: false, inactive: false });
    }
  }, [statusRender]);

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };

  const {
    data: vehicles,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "vehicles",
      {
        page: currentPage,
        size: rowsPerPage,
        searchKeyword,
        sortBy,
        sortOrder,
        istimaraExpireState,
        insuranceExpireState,
        statusVehicle,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/vehicle/list", {
          params: {
            page: currentPage,
            size: rowsPerPage,
            searchKeyword,
            sortBy,
            sortOrder,
            istimaraExpireDate: istimaraExpireState,
            insuranceExpire: insuranceExpireState,
            status: statusVehicle,
          },
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch vehicle data");
      }
    },
  });

  const getStatusClass = (assigned) => {
    switch (assigned) {
      case 0:
        return "bg-green-500 text-white";
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-red-500 text-white";
      default:
        return "";
    }
  };

  const handleDeleteClick = async (vehicleId) => {
    // Logic to delete a vehicle
    console.log("delete", vehicleId);
    try {
      await deleteVehicle(vehicleId);
      toast.success("Vehicle deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting Vehicle");
      console.error("Error deleting Vehicle:", error);
    }
  };

  const handleDetailClick = (vehicleId) => {
    navigate("/detailVehicle", { state: { vehicleId } });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const toggleSearch = () => {
    setSearchKeyword("");
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(0);
  };

  const toggleFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusCheckboxChange = (filterType) => (event) => {
    const isChecked = event.target.checked;

    let updatedFilters = {
      ...statusFilters,
      active: filterType === "active" ? isChecked : false,
      inactive: filterType === "inactive" ? isChecked : false,
    };

    setStatusFilters(updatedFilters);

    // Determine statusVehicle based on selected filters
    if (updatedFilters.active && !updatedFilters.inactive) {
      setStatusVehicle("1"); // Active vehicles
    } else if (!updatedFilters.active && updatedFilters.inactive) {
      setStatusVehicle("0"); // Inactive vehicles
    } else {
      setStatusVehicle("0,1"); // Both active and inactive
    }
  };
  const handleExpireCheckboxChange = (filterType) => (event) => {
    const isChecked = event.target.checked;

    const updatedFilters = { qid: false, passport: false, license: false };

    setExpireFilters({ ...updatedFilters, [filterType]: isChecked });

    // Update istimaraExpireState and insuranceExpireState based on updated filters
    setIstimaraExpireState(filterType === "istimara" && isChecked);
    setInsuranceExpireState(filterType === "insurance" && isChecked);
  };
  const { data: employees } = useQuery({
    queryKey: [
      "employees",
      {
        page: 0,
        size: 10000,
        searchKeyword,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/employees", {
          params: {
            page: 0,
            size: 1000,
            searchKeyword,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch employee data");
      }
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  console.log(errors);
  const onSubmit = async (data) => {
    try {
      const response = await assignVehicle(vehicleData.id, employeeId);
      console.log(response);
      toast.success("Vehicle assigned successfully");
      refetch();
      handleModalClose();
    } catch (error) {
      toast.error("Failed to Assign Vehicle");
      console.error("Failed to assign vehicle:", error);
    }
  };
  const handleModalOpen = (id = null) => {
    setIsModalOpen(true);
    setEmployeeName(vehicles.items.find((v) => v.id === id).userName);
    setVehicleData(id ? vehicles.items.find((v) => v.id === id) : null);
    console.log(id);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setVehicleData(null);
    // setSelectedDocumentId(null);
    // setFile(null);
  };
  const handleRemoveAssignment=async() => {
    try {
      const response = await removeAssignee(vehicleData.id);
      console.log(response);
      toast.success("Vehicle Assignee Removed successfully");
      refetch();
      handleModalClose();
    } catch (error) {
      toast.error("Failed to Unassign Vehicle");
      console.error("Failed to unassign vehicle:", error);
    }
  };
  const handleEditClick = (id) => {
    if(id!=null) {
    navigate(`/addVehicle/${id}`);
    }
  // setIsModalOpen(true);  // Set state to open the modal
};

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <h2 className="text-2xl font-bold mb-4">Vehicle List</h2>

      <div className="flex justify-end gap-5 mr-8">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            id="search"
            onClick={toggleSearch}
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
                checked={statusFilters.active}
                onChange={handleStatusCheckboxChange("active")}
              />
              Active
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={statusFilters.inactive}
                onChange={handleStatusCheckboxChange("inactive")}
              />
              Inactive
            </MenuItem>
            <MenuItem>
              <p className="text-sm">Expire details</p>
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={expireFilters.Istimara}
                onChange={handleExpireCheckboxChange("istimara")}
              />
              Istimara Expire
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={expireFilters.Insurance}
                onChange={handleExpireCheckboxChange("insurance")}
              />
              Insurance Expire
            </MenuItem>
          </Menu>
        </div>
        <div>
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

      {searchOpen && (
        <div className="mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search by vehicle number"
            className="p-2 w-1/3 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <div className="flex justify-center">
          <p>Error: {error.message}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl.No</TableCell>
                  <TableCell
                    onClick={() => handleSort("vehicleNumber")}
                    className="cursor-pointer"
                  >
                    Vehicle Number
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("brand")}
                    className="cursor-pointer"
                  >
                    Brand (Model)
                  </TableCell>

                  <TableCell>Registration Date</TableCell>
                  {/* <TableCell>Istimara Number</TableCell> */}
                  <TableCell
                    onClick={() => handleSort("istimaraDate")}
                    className="cursor-pointer"
                  >
                    Istimara Date
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("insuranceExpire")}
                    className="cursor-pointer"
                  >
                    Insurance Expire
                  </TableCell>
                  <TableCell>Assigned To</TableCell>

                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.items.map((vehicle, index) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{vehicle.vehicleNumber}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 0 }}>{vehicle.brand}</div>
                        <div
                          className="text-gray-500"
                          style={{ marginLeft: "5px" }}
                        >
                          (<span className="font-bold">{vehicle.modal}</span>)
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="items-center">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 0 }}>
                          {vehicle.registrationDate &&
                          vehicle.registrationDate.length === 3 &&
                          vehicle.registrationDate[0] !== 0
                            ? new Date(
                                vehicle.registrationDate[0],
                                vehicle.registrationDate[1] - 1,
                                vehicle.registrationDate[2]
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>{vehicle.istimaraNumber}</TableCell> */}

                    <TableCell className="items-center">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 0 }}>
                          {new Date(
                            vehicle.istimaraDate[0],
                            vehicle.istimaraDate[1] - 1,
                            vehicle.istimaraDate[2]
                          ).toLocaleDateString()}
                        </div>
                        <div
                          className="text-red-700"
                          style={{ marginLeft: "5px" }}
                        >
                          (
                          <span className="font-bold">
                            {vehicle.noOfDaysIstimaraExpire}
                          </span>
                          ) days
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="items-center">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 0 }}>
                          {new Date(
                            vehicle.insuranceExpire[0],
                            vehicle.insuranceExpire[1] - 1,
                            vehicle.insuranceExpire[2]
                          ).toLocaleDateString()}
                        </div>
                        <div
                          className="text-red-700"
                          style={{ marginLeft: "5px" }}
                        >
                          (
                          <span className="font-bold">
                            {vehicle.noOfDaysInsuranceExpire}
                          </span>
                          ) days
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.userName ? vehicle.userName : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-4 py-1 ${getStatusClass(
                          vehicle.assigned
                        )}`}
                      >
                        {vehicle.assigned === 0
                          ? "Assigned"
                          : vehicle.assigned === 1
                          ? "Idle"
                          : "Repair"}
                      </span>
                    </TableCell>
                    <TableCell className="items-center">
                      <div className="flex gap-3">
                      {role!==5 &&(
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          id="edit"
                          onClick={() => handleEditClick(vehicle.id)} 
                          style={{ cursor: "pointer" }}
                        >
                          <path fill="none" d="M0 0h24v24H0V0z"></path>
                          <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                        </svg>
                      )}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          id="view"
                          onClick={() => handleDetailClick(vehicle.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <g>
                            <path d="M23.91 11.58C21.94 7.31 17.5 3 12 3S2.06 7.31.09 11.58a1.025 1.025 0 0 0 0 .84C2.06 16.69 6.5 21 12 21s9.94-4.31 11.91-8.58a1.025 1.025 0 0 0 0-.84ZM12 17a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </g>
                        </svg>
                        {role!==5 &&(
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          id="delete"
                          onClick={() => handleDeleteClick(vehicle.id)}
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
                        )}
                        {vehicle.status === 1 && role!==5 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 51.665 51.665"
                            width="24"
                            height="24"
                            fill="#000"
                            onClick={() => handleModalOpen(vehicle.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <circle cx="9.3" cy="8.585" r="3.817" />
                            <path
                              d="M14.923,18.418l6.647,6.039v-0.003c0.004,0.006,0.005,0.011,0.011,0.011c0.629,0.627,1.65,0.627,2.279,0
      c0.629-0.626,0.625-1.646-0.002-2.277c-0.005,0-0.008-0.004-0.01-0.011l-6.271-6.263c-2.01-2.08-4.641-2.281-4.641-2.281h-7.65
      c-5.479,0.105-5.285,4.126-5.285,4.126v9.389h0.006c-0.001,0.022-0.005,0.049-0.005,0.066c0,0.895,0.723,1.612,1.61,1.612
      c0.89,0,1.61-0.72,1.61-1.612c0-0.02-0.003-0.043-0.005-0.066h0.005v-8.689h1.009L4.216,44.714c0,1.205,0.977,2.183,2.182,2.183
      c1.194,0,2.174-0.978,2.174-2.183L8.567,28.161h0.974v16.573l0.019,0.018c0.012,1.186,0.977,2.143,2.162,2.143
      c1.197,0,2.162-0.971,2.162-2.166l-0.006-26.311H14.923z"
                            />
                            <path
                              d="M51.565,26.173c-0.229-2.002-5.624,0-5.624,0l-0.318,2.852c-0.119-0.066-0.236-0.129-0.363-0.188l-1.363-5.948
      c-0.498-2.834-2.637-4.916-5.753-4.811l-16.686-0.003c0,0,0.883,0.97,0.922,0.97h16.303c1.818,0,3.482,1.171,3.939,3.104
      l1.465,5.874c-0.092-0.002-0.183-0.012-0.273-0.012H19.437c-0.093,0-0.186,0.01-0.276,0.012l0.763-3.052l-0.865-0.785
      l-1.067,4.652c-0.125,0.059-0.245,0.121-0.362,0.188l-0.317-2.852c0,0-1.344-0.589-2.743-0.807l0.001,3.688l2.771,0.149
      c-1.057,0.706-1.733,1.776-1.733,2.983v5.449c0,1.354,0.856,2.543,2.148,3.229v3.663c0,1.238,1.529,2.244,3.419,2.244
      c1.889,0,3.418-1.006,3.418-2.244v-3.045h13.484v3.045c0,1.238,1.527,2.244,3.418,2.244c1.887,0,3.418-1.006,3.418-2.244v-3.399
      c1.613-0.608,2.735-1.942,2.735-3.493v-5.451c0-1.207-0.677-2.276-1.731-2.981L51.57,28.9C51.565,28.9,51.791,28.18,51.565,26.173z
      M25.183,36.58h-6.17v-2.934h6.17V36.58z M37.654,36.58H26.447v-1.262h11.207V36.58z M37.654,35.007H26.447v-1.262h11.207V35.007
      z M45.087,36.58h-6.17v-2.934h6.17V36.58z"
                            />
                          </svg>
                        )}
                      </div>
                   
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={vehicles.totalItems}
            page={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <div className="flex justify-center items-center h-full">
          <div className="bg-white rounded-md p-8 w-1/3">
            <div className="flex gap-36 ">
              <div className="flex justify-start items-start">
                <h2 className="text-2xl font-bold mb-4">Assign Vehicle</h2>
              </div>
              <div className="flex justify-end items-end">
                {vehicleData && vehicleData.assigned === 0 && (
                  <MyButton type="button" onClick={handleRemoveAssignment}>
                    Remove Assignment
                  </MyButton>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormControl fullWidth margin="normal">
                <InputLabel>Employee</InputLabel>
                <Select native onChange={(e) => setEmployeeId(e.target.value)}>
                  <option value="" />
                  {employees?.items?.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <div className="flex justify-center space-x-4 mt-4">
                <MyButton type="submit" on>
                  Submit
                </MyButton>
                <MyButton type="reset" onClick={handleModalClose}>
                  Cancel
                </MyButton>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VehicleList;
