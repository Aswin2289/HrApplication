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

function EmployeeDashboard() {
  const { getTicketLeaveAvailablity } = useAddLeaveEmployee();
  const [ticketLeaveAvailability, setTicketLeaveAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysLeftInMonth, setDaysLeftInMonth] = useState(0);

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

    fetchTicketLeaveAvailability();
  }, [getTicketLeaveAvailablity]);

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
    marginBottom: "15px", // Added margin bottom for spacing between cards
  };

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
        <img
          src={workInProgressGif}
          alt="Work in Progress"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Card style={cardStyle}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <img
                      src={holidays}
                      alt="2 Year Leave"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6">10 Year Leave</Typography>
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
