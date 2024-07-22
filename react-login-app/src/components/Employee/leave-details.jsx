import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAddLeaveEmployee from "../../hooks/add-leave-employee";
import MyButton from "../Button/my-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAuth from "../../hooks/use-auth";
import { ToastContainer, toast } from "react-toastify";
import { Modal, FormControl, TextField } from "@mui/material";
import useEmployeeDetails from "../../hooks/useEmployeeDetails";
import useLeaveTypes from "../../hooks/use-leave-type";
import useLeaveApplication from "../../hooks/use-leave-application";

function LeaveDetails() {
  const schema = z.object({
    leaveType: z.string().nonempty("Leave type is required"), // Updated to string
    leaveFrom: z.date(),
    leaveTo: z.date(),
    reason: z
      .string()
      .min(1, "Reason is required")
      .max(100, "Reason must be less than 100 characters"),
  });

  const {
    getLeaveCountEmployee,
    getTicketLeaveAvailablity,
    getYearEligiblity,
  } = useAddLeaveEmployee();
  const { applyLeaveApplication } = useLeaveApplication();
  const { leaveTypes } = useLeaveTypes();
  const { getUserDetails } = useAuth();
  const { userId,id } = getUserDetails();
  const { employeeDetails } = useEmployeeDetails(userId);

  const [leaveData, setLeaveData] = useState({});
  const [ticketLeaveAvailability, setTicketLeaveAvailability] = useState(null);
  const [yearEligiblity, setYearEligiblity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibleApply, setEligibleApply] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    const fetchLeaveCount = async () => {
      try {
        const response = await getLeaveCountEmployee();
        const transformedData = {};
        
        Object.keys(response.body).forEach((key) => {
          transformedData[key.toLowerCase()] = response.body[key];
        });
        setLeaveData(transformedData);
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };

    const fetchTicketLeaveAvailability = async () => {
      try {
        const response = await getTicketLeaveAvailablity();
        setTicketLeaveAvailability(response);

        setEligibleApply(response.applyEligibility);
      } catch (error) {
        console.error("Failed to fetch ticket leave availability:", error);
      }
    };

    const fetchYearEligiblity = async () => {
      try {
        const response = await getYearEligiblity();
        console.log("Year Eligibility", response);
        setYearEligiblity(response.eligibleYears);
      } catch (error) {
        console.error("Failed to fetch year eligibility:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetch
      }
    };

    fetchLeaveCount();
    fetchTicketLeaveAvailability();
    fetchYearEligiblity();
  }, [getLeaveCountEmployee, getTicketLeaveAvailablity, getYearEligiblity]);

  useEffect(() => {
    // Reset form when modal opens
    if (isModalOpen) {
      reset();
    }
  }, [isModalOpen, reset]);

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  const filterLeaveData = (data, eligibleYears) => {
   
    if (eligibleYears === 0,1) {
      delete data["two year"];
      // delete data["one year"];
    }
    return data;
  };

  const filteredLeaveData = filterLeaveData({ ...leaveData }, yearEligiblity);

  const sortedLeaveDataKeys = Object.keys(filteredLeaveData).sort((a, b) => {
    const orderCountA = filteredLeaveData[a].orderCount || 0;
    const orderCountB = filteredLeaveData[b].orderCount || 0;
    return orderCountA - orderCountB;
  });

  const handleAddApplication = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const calculateMaxDate = () => {
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + 90); // Adding 90 days to startDate
    return maxDate;
  };
  const calculateDaysBetween = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const onSubmit = async (data) => {
    console.log(data);
    const formData = {
      leaveType: parseInt(data.leaveType, 10), // Ensure leaveType is a number
      from: startDate.toISOString().split("T")[0], // Convert startDate to ISO string
      to: endDate.toISOString().split("T")[0], // Convert endDate to ISO string
      user: id,
      reason: data.reason,
    };
    console.log(formData);

    try {
      await applyLeaveApplication(formData);
      toast.success("Leave application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to submit leave application.");
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />

      {eligibleApply && (
        <div className="flex justify-end items-end mb-2 mr-5">
          <MyButton type="button" onClick={handleAddApplication}>
            Click to Apply for Vacation
          </MyButton>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sortedLeaveDataKeys.map((leaveType) => {
          const leaveDetails = filteredLeaveData[leaveType] || {
            totalLeaveAddedPerYear: 0,
            totalLeaveTakenPerYear: 0,
            totalLeave: 0, // Initialize totalLeave to 0 if not present
          };
          const { totalLeaveAddedPerYear, totalLeaveTakenPerYear, totalLeave } =
            leaveDetails;
          let percentage =
            (totalLeaveTakenPerYear / totalLeaveAddedPerYear) * 100;
          if (isNaN(percentage)) {
            percentage = 0;
          }
          return (
            <div className="flex justify-center" key={leaveType}>
              <div className="w-full sm:w-4/4 md:w-3/3 lg:w-3/3 bg-white rounded-lg p-4 flex items-center shadow-md">
                <div className="w-14 h-14">
                  <CircularProgressbar
                    value={percentage}
                    text={`${Math.round(percentage)}%`}
                    styles={buildStyles({
                      textColor: "#3e98c7",
                      pathColor: "#ff2121",
                      trailColor: "#3e98c7",
                    })}
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold capitalize">
                    {leaveType.replace(/ *\([^)]*\) */g, "").replace(/_/g, " ")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    <b>{totalLeaveAddedPerYear}</b> Credited,{" "}
                    <b>{totalLeaveTakenPerYear}</b> Availed
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {ticketLeaveAvailability !== null &&
          typeof ticketLeaveAvailability !== "undefined" && (
            <div className="flex justify-start ">
              <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/3 bg-white rounded-lg p-4 flex flex-col items-start shadow-md">
                <h2 className="text-lg font-semibold capitalize mb-2">
                  Air Ticket Eligibility
                </h2>
                <p className="text-sm text-gray-500">
                  <b>{ticketLeaveAvailability.daysLeft}</b> days left
                </p>
                <p className="text-sm text-gray-500">
                  Eligible from:{" "}
                  <b>{`${ticketLeaveAvailability.eligibilityDate[2]}-${ticketLeaveAvailability.eligibilityDate[1]}-${ticketLeaveAvailability.eligibilityDate[0]}`}</b>
                </p>
                <p className="text-sm text-gray-500">
                  Eligibility Status:{" "}
                  <b
                    className={
                      ticketLeaveAvailability.eligible
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {ticketLeaveAvailability.eligible
                      ? "Eligible"
                      : "Not Eligible"}
                  </b>
                </p>
              </div>
            </div>
          )}

        <Modal open={isModalOpen} onClose={handleModalClose}>
          <div className="w-full max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Leave</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <TextField
                  id="leaveType"
                  label="Leave Type"
                  value="1" // Set value to "1" for "one year"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true, // Make the TextField read-only
                  }}
                  {...register("leaveType")} // Register the field with react-hook-form
                />
              </FormControl>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  name="leaveFrom"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setValue("leaveFrom", date);

                    if (endDate && date > endDate) {
                      setEndDate(null); // Reset endDate if it's invalid
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd-MM-yyyy"
                  className="form-input border border-gray-300 rounded-md px-3 py-2 w-full"
                />
                {errors.leaveFrom && (
                  <span className="text-red-600">
                    {errors.leaveFrom.message}
                  </span>
                )}
              </div>
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  name="leaveTo"
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setValue("leaveTo", date);
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={calculateMaxDate()}
                  dateFormat="dd-MM-yyyy"
                  className="form-input border border-gray-300 rounded-md px-3 py-2 w-full"
                />
                {errors.leaveTo && (
                  <span className="text-red-600">{errors.leaveTo.message}</span>
                )}
              </div>
              <div className="flex">
                <p className="text-gray-500 text-sm">Note:&nbsp;</p>
                <p> {calculateDaysBetween()} </p>
                <p className="text-gray-500 text-sm"> &nbsp;/days selected</p>
              </div>
              <TextField
                label="Reason"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                {...register("reason")}
                error={!!errors.reason}
                helperText={errors.reason ? errors.reason.message : ""}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                >
                  Submit
                </button>
                <MyButton type="reset" onClick={handleModalClose}>
                  Cancel
                </MyButton>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default LeaveDetails;
