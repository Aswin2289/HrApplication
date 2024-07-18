import React, { useEffect, useState } from "react";
import workInProgressGif from "../../profile/nice.gif";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Lottie from "lottie-react";
import lottieSampleAnimation from "../../profile/dollar-donation.json"; // Sample Lottie animation
import homeIcon from "../../profile/home-button.json";
import useAddLeaveEmployee from "../../hooks/add-leave-employee";
import holidays from "../../profile/holiday_4343468.png";
import useAuth from "../../hooks/use-auth";
import useEmployeeDetails from "../../hooks/useEmployeeDetails";
import { ToastContainer, toast } from "react-toastify";

function EmployeeDashboard() {
  const { getTicketLeaveAvailablity, getExperince } = useAddLeaveEmployee();
  const { getUserDetails } = useAuth();
  const { userId, id } = getUserDetails();
  const [ticketLeaveAvailability, setTicketLeaveAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysLeftInMonth, setDaysLeftInMonth] = useState(0);
  const [experience, setExperience] = useState({
    totalWithPrev: 0,
    totalWithoutPrev: 0,
  });
  const { employeeDetails, isLoading, error } = useEmployeeDetails(userId);
  useEffect(() => {
    const fetchTicketLeaveAvailability = async () => {
      try {
        const response = await getTicketLeaveAvailablity();
        setTicketLeaveAvailability(response);
      } catch (error) {
        console.error("Failed to fetch ticket leave availability:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetch
      }
    };

    const fetchTotalExperience = async () => {
      try {
        const response = await getExperince(userId);
        setExperience(response);
        console.log("total experience: ", response);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      }
    };

    fetchTicketLeaveAvailability();
    fetchTotalExperience();
  }, [getTicketLeaveAvailablity, getExperince, userId]);

  useEffect(() => {
    const calculateDaysLeftInMonth = () => {
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      const daysLeft = lastDayOfMonth.getDate() - today.getDate();
      setDaysLeftInMonth(daysLeft);
    };

    calculateDaysLeftInMonth();
  }, []);

  const cardStyle = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: "10px",
    // marginBottom: "5px", // Added margin bottom for spacing between cards
  };

  // Calculate years and months from totalWithoutPrev
  const years = Math.floor(experience.totalWithoutPrev);
  const months = Math.round((experience.totalWithoutPrev - years) * 12);
  if (!employeeDetails) {
    return <div>No employee details found.</div>;
  }
  return (
    <div
      className="flex flex-wrap justify-center items-start"
      style={{
        minHeight: "100vh",
        paddingTop: "20px",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <div
        className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3"
        style={{ paddingRight: "20px" }}
      >
        {/* <img
          src={workInProgressGif}
          alt="Work in Progress"
          style={{ width: "100%", height: "auto" }}
        /> */}

        <div className="flex justify-center items-center bg-gray-100 mt-5">
          <ToastContainer
            theme="colored"
            autoClose={2000}
            stacked
            closeOnClick
          />
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 flex flex-col md:flex-row w-full md:max-w-4/5 lg:max-w-3/4 xl:max-w-2/3">
            <div className="w-full md:w-2/3 md:pr-6">
              <h2 className="text-3xl font-bold mb-4">
                {/* {employeeDetails.name}{" "} */}
                {/* <span
                  className={`${
                    employeeDetails.status === 1
                      ? "bg-green-500 text-white rounded-md p-1"
                      : "bg-red-500 text-white rounded-md p-1"
                  } font-normal text-sm`}
                >
                  {employeeDetails.status === 1 ? "On Premises" : "Vacation"}
                </span> */}
              </h2>
              {/* <p className="text-gray-600 mb-4">{employeeDetails.role}</p> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">QID:</span>
                  <span>{employeeDetails.qid}</span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">Employee ID:</span>
                  <span>{employeeDetails.employeeId}</span>
                </div>
                
                
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">Passport No:</span>
                  <span>{employeeDetails.passport}</span>
                </div>
                
               
                
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">QID Expire:</span>
                  <span>
                    {employeeDetails.qidExpire.join("-")},{" "}
                    <span className="font-extrabold text-red-800">
                      {employeeDetails.noOfDaysQidExpire}
                    </span>{" "}
                    days left
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">
                    Passport Expire:
                  </span>
                  <span>
                    {employeeDetails.passportExpire.join("-")},{" "}
                    <span className="font-extrabold text-red-800">
                      {employeeDetails.noOfDaysPassportExpire}
                    </span>{" "}
                    days left
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="text-gray-700 font-bold">
                    License Expire:
                  </span>
                  <span>
                    {employeeDetails.licenseExpire.join("-")},{" "}
                    <span className="font-extrabold text-red-800">
                      {employeeDetails.noOfDaysLicenseExpire}
                    </span>{" "}
                    days left
                  </span>
                </div>
              </div>
            </div>
           
            <div className="w-full md:w-1/3 flex flex-col justify-between items-center">
              <img
                src="https://via.placeholder.com/150"
                alt=""
                className="rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-14 md:w-1/3 lg:w-1/3 xl:w-1/3">
        <Grid container spacing={2} direction="column">
          
          <Grid item style={{ marginTop: "20px" }}>
            <Card style={cardStyle}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <img
                      src={holidays}
                      alt="10 Year Leave"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                  <Typography variant="h5">Total Experience</Typography>
                    <Typography variant="body1" className="text-red-600">
                      {years} years {months} months
                    </Typography>
                    
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card style={cardStyle}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <Lottie
                      animationData={homeIcon}
                      loop={true}
                      style={{ width: "40px", height: "40px" }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                  <Typography variant="h5" component="span">
                      Air Ticket Eligibility
                    </Typography>
                    {loading ? (
                      <Typography variant="body2">Loading...</Typography>
                    ) : ticketLeaveAvailability ? (
                      <>
                        <Typography variant="body2">
                          Days Left: {ticketLeaveAvailability.daysLeft}
                        </Typography>
                        <Typography variant="body2">
                          Date:{" "}
                          {`${ticketLeaveAvailability.eligibilityDate[0]}-${ticketLeaveAvailability.eligibilityDate[1]}-${ticketLeaveAvailability.eligibilityDate[2]}`}
                        </Typography>
                        <Typography variant="body2">
                          Eligible:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: ticketLeaveAvailability.eligible
                                ? "green"
                                : "red",
                            }}
                          >
                            {ticketLeaveAvailability.eligible ? "Yes" : "No"}
                          </span>
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">No data available</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card style={cardStyle}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <Lottie animationData={lottieSampleAnimation} loop={true} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h4" component="span">
                      {daysLeftInMonth}
                    </Typography>
                    <Typography variant="body2" component="span">
                      /Days left
                    </Typography>
                    <Typography variant="body2"> Next Pay Check</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
