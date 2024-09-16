import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { axiosInstance } from "../../services/interceptor";
import PrintIcon from "@mui/icons-material/Print";

function ApprovedLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchLeave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/leave/approvedLeave", {
        params: {
          page: currentPage,
          size: rowsPerPage,
        },
      });
      setLeaveTypes(response.data.items); // Assuming response.data.items contains the leave data
    } catch (error) {
      setError("Failed to fetch leave");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave(); // Fetch leave data when the component mounts or when currentPage/rowsPerPage changes
  }, [currentPage, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDeleteClick = (id) => {
    console.log("Delete Leave with id: ", id);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-500 text-white";
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-orange-500 text-white";
      default:
        return "";
    }
  };
  const isDeleteButtonDisabled = (fromDate) => {
    const leaveDate = new Date(fromDate[0], fromDate[1] - 1, fromDate[2]);
    return leaveDate < new Date();
  };
  const handlePrint = async () => {
    window.print();
  };
  return (
    <div className="container mx-auto mt-8">
      <div className="flex ">
        <h1 className="text-2xl font-bold mb-4">Approved Leave</h1>
        <button onClick={handlePrint} className="ml-3 print-button mb-3">
          <PrintIcon />
        </button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : leaveTypes && leaveTypes.length > 0 ? (
              leaveTypes
                .slice(
                  currentPage * rowsPerPage,
                  currentPage * rowsPerPage + rowsPerPage
                )
                .map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>
                      {new Date(
                        leave.from[0],
                        leave.from[1] - 1,
                        leave.from[2]
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        leave.to[0],
                        leave.to[1] - 1,
                        leave.to[2]
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-4 py-1 ${getStatusClass(
                          leave.status
                        )}`}
                      >
                        {leave.status === 0
                          ? "Confirmed"
                          : leave.status === 1
                          ? "Pending"
                          : "Accepted By HR"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          id="delete"
                          // onClick={() => handleDeleteClick(leave.id)}
                          onClick={() =>
                            !isDeleteButtonDisabled(leave.from) &&
                            handleDeleteClick(leave.id)
                          }
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
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={leaveTypes.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ApprovedLeave;
