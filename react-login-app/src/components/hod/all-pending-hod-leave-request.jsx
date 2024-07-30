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
import useHodPendingLeave from "../../hooks/use-hod-pending-leave";
function AllPendingHodLeaveRequest() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { rejectPendingLeave, acceptPendingLeave, deletePendingLeave } =
    useHodPendingLeave();
  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-500 text-white";
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-orange-500 text-white";
      case 10:
        return "bg-orange-500 text-white";
      default:
        return "";
    }
  };
  const fetchLeave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/leave/hod/pendingLeave", {
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
    fetchLeave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDeleteClick = async (id) => {
    console.log("Delete Leave with id: ", id);
    try {
      const response = await deletePendingLeave(id);
      console.log(response);
      fetchLeave();
    } catch (error) {
      console.error(
        "Failed to Delete Request:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to Delete Request");
    }
  };

  const handleApproveClick = async (id) => {
    console.log("Approve Leave with id: ", id);
    try {
      const response = await acceptPendingLeave(id);
      console.log(response);
      fetchLeave();
    } catch (error) {
      console.error(
        "Failed to accept leave:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to reject leave");
    }
  };

  const handleRejectClick = async (id) => {
    console.log("Reject Leave with id: ", id);
    try {
      const response = await rejectPendingLeave(id);
      console.log(response);
      fetchLeave();
    } catch (error) {
      console.error(
        "Failed to reject leave:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to reject leave");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Pending Leave</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Available Balance
              </TableCell>
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
                    <TableCell>{leave.name}</TableCell>
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
                    <TableCell>{leave.availableLeaveBalance}</TableCell>
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
                          : leave.status === 2
                          ? "Accepted By HR"
                          : "Accepted By HOD"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <svg
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 30 30"
                          onClick={() => handleApproveClick(leave.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <g>
                            <path
                              fill="#02d91b"
                              d="M15.129,0C6.773,0,0,6.772,0,15.13c0,8.354,6.773,15.128,15.129,15.128s15.129-6.773,15.129-15.128
            C30.258,6.772,23.484,0,15.129,0z M15.129,27.854c-7.027,0-12.725-5.697-12.725-12.726c0-7.026,5.697-12.725,12.725-12.725
            s12.727,5.698,12.727,12.725C27.855,22.156,22.156,27.854,15.129,27.854z"
                            />
                            <path
                              fill="#02d91b"
                              d="M25.854,9.989l-1.762-1.762c-0.322-0.324-0.85-0.324-1.172,0L12.361,18.786l-5.023-5.061
            c-0.324-0.323-0.848-0.323-1.174,0l-1.76,1.761c-0.324,0.322-0.324,0.851,0,1.175l5.586,5.626l0.016,0.025l1.219,1.219l0.283,0.281
            l0.26,0.262c0.322,0.32,0.85,0.32,1.174,0l12.912-12.912C26.178,10.839,26.178,10.312,25.854,9.989z"
                            />
                          </g>
                        </svg>
                        <svg
                          version="1.0"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 30 30"
                          preserveAspectRatio="xMidYMid meet"
                          onClick={() => handleRejectClick(leave.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <g
                            transform="translate(0.000000,30.000000) scale(0.005859,-0.005859)"
                            fill="#e82727"
                            stroke="none"
                          >
                            <path
                              d="M2365 5109 c-619 -51 -1172 -306 -1610 -744 -642 -640 -895 -1560
    -672 -2440 155 -611 535 -1143 1066 -1497 747 -496 1702 -564 2510 -177 421
    201 779 513 1038 904 302 454 454 1030 415 1568 -38 520 -201 961 -511 1377
    -94 126 -323 363 -441 456 -369 290 -815 480 -1260 538 -152 20 -398 27 -535
    15z m472 -264 c787 -103 1444 -573 1788 -1280 168 -343 244 -698 232 -1070 -7
    -199 -26 -329 -73 -513 -127 -496 -429 -949 -839 -1258 -320 -240 -667 -383
    -1065 -439 -153 -21 -448 -21 -600 0 -1042 146 -1833 931 -1986 1970 -21 144
    -24 445 -6 585 55 416 212 800 465 1134 80 107 271 301 377 386 341 271 748
    441 1170 489 128 14 410 12 537 -4z"
                            />
                            <path
                              d="M3719 4097 c-25 -7 -61 -23 -80 -36 -19 -13 -269 -258 -556 -545
    l-523 -521 -527 527 c-594 593 -576 578 -713 578 -125 0 -216 -54 -269 -162
    -27 -52 -31 -72 -31 -137 0 -138 -15 -120 578 -714 l526 -527 -530 -533 c-597
    -598 -579 -577 -578 -712 1 -126 55 -214 167 -272 43 -22 65 -27 132 -27 136
    -1 114 -19 713 578 l532 531 523 -521 c287 -287 536 -531 553 -542 17 -12 58
    -29 90 -37 178 -47 354 74 378 260 8 59 -14 151 -46 199 -11 17 -255 266 -542
    553 l-521 523 531 532 c597 599 579 578 578 713 0 92 -23 150 -80 209 -75 78
    -202 112 -305 83z"
                            />
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          id="delete"
                          onClick={() => handleDeleteClick(leave.id)}
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
                  No leave data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
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
export default AllPendingHodLeaveRequest;
