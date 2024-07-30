import React, { useState, useEffect } from "react";
import useEmployeeDetails from "../hooks/useEmployeeDetails";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  TextField,
  Modal,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import useLeaveTypes from "../hooks/use-leave-type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyButton from "./Button/my-button";
import useAuth from "../hooks/use-auth";
import DatePickerModal from "./date-picker-modal";
const schema = z.object({
  leaveType: z.number().min(1, "Leave type is required"),
  days: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Please enter a valid number",
  }),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(100, "Reason must be less than 100 characters"),
  transactionType: z
    .number()
    .min(0, "Leave status is required")
    .max(1, "Invalid leave status value"),
});

const EmployeeDetails = () => {
  const location = useLocation();
  const { employeeId } = location.state;
  const { employeeDetails, isLoading, error } = useEmployeeDetails(employeeId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [isModalOpenEligibility, setIsModalOpenEligibility] = useState(false);
  
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();
  const {
    leaveTypes,
    isLoading: leaveTypesLoading,
    error: leaveTypesError,
    addLeave,
    leaveTypesHr,
  } = useLeaveTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  useEffect(() => {
    // Reset form when modal opens
    if (isModalOpen) {
      reset();
    }
  }, [isModalOpen, reset]);

  if (isLoading || leaveTypesLoading) {
    return <CircularProgress />;
  }

  if (error || leaveTypesError) {
    return <div>Error: {error || leaveTypesError}</div>;
  }

  if (!employeeDetails) {
    return <div>No employee details found.</div>;
  }
  const handleLeaveTypeChange = (event) => {
    const value = event.target.value;
    setSelectedLeaveType(value);
    // Set the value of leaveType for validation
    setValue("leaveType", value);
  };
  const handleLeaveStatusChange = (event) => {
    const value = event.target.value;
    console.log(value);
    setSelectedTransactionType(value);
    // Set the value of leaveStatus for validation
    setValue("transactionType", value);
  };
  const handleAddLeave = () => {
    setIsModalOpen(true);
  };
  const handleUpdateEligiblity = () => {
    setIsModalOpenEligibility(true);
  };
  const handleCloseModalEligibility = () => {
    setIsModalOpenEligibility(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLeaveType("");
    reset();
  };

  const onSubmit = async (data, e) => {
    try {
      const leaveData = {
        daysUpdated: parseInt(data.days), // Assuming 'days' is a string, parse it to an integer
        user: employeeDetails.id, // Assuming this value is fixed or determined from somewhere else
        reason: data.reason,
        leaveType: selectedLeaveType,
        transactionType: selectedTransactionType,
      };
      console.log(leaveData);
      await addLeave(leaveData); // Call the addLeave function from the useLeaveTypes hook
      toast.success("Leave added successfully");
      e.target.reset();
    } catch (error) {
      toast.error("Failed to submit leave:", error);
      console.error("Failed to submit leave:", error);
    }
    setIsModalOpen(false);
  };
  const handleRejoinVacation = () => {
    toast.success("Leave added successfully");
  };
  return (
    <div className="flex justify-center items-center bg-gray-100 mt-5">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 flex flex-col md:flex-row w-full md:max-w-4/5 lg:max-w-3/4 xl:max-w-2/3">
        <div className="w-full md:w-2/3 md:pr-6">
          <h2 className="text-3xl font-bold mb-4">
            {employeeDetails.name}{" "}
            <span
              className={`${
                employeeDetails.status === 1
                  ? "bg-green-500 text-white rounded-md p-1"
                  : "bg-red-500 text-white rounded-md p-1"
              } font-normal text-sm`}
            >
              {employeeDetails.status === 1 ? "On Premises" : "Vacation"}
            </span>
          </h2>
          <p className="text-gray-600 mb-4">{employeeDetails.role}</p>
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
              <span className="text-gray-700 font-bold">Job Title:</span>
              <span>{employeeDetails.jobTitle}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Nationality:</span>
              <span>{employeeDetails.nationality}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Gender:</span>
              <span>{employeeDetails.gender === 0 ? "Male" : "Female"}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Contract Period:</span>
              <span>{employeeDetails.contractPeriod} months</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Passport No:</span>
              <span>{employeeDetails.passport}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Qualification:</span>
              <span>{employeeDetails.qualification}</span>
            </div>

            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Total Experience:</span>
              <span>{employeeDetails.totalExperience} years</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Joining Date:</span>
              <span>
                {new Date(employeeDetails.joiningDate).toLocaleDateString()}
              </span>
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
              <span className="text-gray-700 font-bold">Passport Expire:</span>
              <span>
                {employeeDetails.passportExpire.join("-")},{" "}
                <span className="font-extrabold text-red-800">
                  {employeeDetails.noOfDaysPassportExpire}
                </span>{" "}
                days left
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">License:</span>
              {employeeDetails.license ? (
                <span> {employeeDetails.license}</span>
              ) : (
                "N/A"
              )}
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">License Expire:</span>
              <span>
                {employeeDetails.licenseExpire ? (
                  <>
                    {employeeDetails.licenseExpire.join("-")},{" "}
                    <span className="font-extrabold text-red-800">
                      {employeeDetails.noOfDaysLicenseExpire}
                    </span>{" "}
                    days left
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
          <div className="flex justify-start space-x-4">
            <Button
              variant="contained"
              style={{
                textTransform: "none",
                backgroundColor:
                  employeeDetails.status === 1 ? "orange" : "green",
              }}
              onClick={handleRejoinVacation}
            >
              {employeeDetails.status === 1 ? "Vacation" : "Re-joining"}
            </Button>
            <Button
              disabled={role !== 1 && role !== 4}
              variant="contained"
              style={{
                textTransform: "none",
                backgroundColor:
                  employeeDetails.status === 1 ? "orange" : "green",
              }}
              onClick={handleAddLeave}
            >
              Add Leave
            </Button>
            <Button
              disabled={role !== 1 && role !== 4&& role !== 2}
              variant="contained"
              style={{
                textTransform: "none",
                backgroundColor:
                  employeeDetails.status === 1 ? "orange" : "green",
              }}
              onClick={handleUpdateEligiblity}
            >
              Update Last Eligiblity
            </Button>
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
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="add-leave-modal-title"
        aria-describedby="add-leave-modal-description"
        className="flex justify-center items-center"
      >
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 id="add-leave-modal-title" className="text-2xl font-bold mb-4">
            Add Leave
          </h2>
          <p className="text-gray-600 mb-4">
            Employee: {employeeDetails.name} ({employeeDetails.role})
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormControl fullWidth error={!!errors.leaveType}>
              <InputLabel id="leave-type-label">Leave Type</InputLabel>
              <Select
                labelId="leave-type-label"
                id="leave-type"
                value={selectedLeaveType}
                onChange={handleLeaveTypeChange}
                label="Leave Type"
              >
                {leaveTypesHr && leaveTypesHr.length > 0 ? (
                  leaveTypesHr
                    .filter((leaveType) => {
                      // Check role and filter leave types accordingly
                      if (role === 4) {
                        return (
                          leaveType.id === 2 ||
                          leaveType.id === 3 ||
                          leaveType.id === 5
                        );
                      }
                      // If role is not 4, display all leave types
                      return true;
                    })
                    .map((leaveType) => (
                      <MenuItem key={leaveType.id} value={leaveType.id}>
                        {leaveType.name}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem value="">
                    <em>No leave types available</em>
                  </MenuItem>
                )}
              </Select>
              {errors.leaveType && (
                <p className="text-red-500">{errors.leaveType.message}</p>
              )}
            </FormControl>
            <FormControl fullWidth variant="outlined" className="mb-4">
              <InputLabel id="leave-status-label">Leave Status</InputLabel>
              <Select
                {...register("transactionType")}
                labelId="leave-status-label"
                id="transaction-type"
                value={selectedTransactionType}
                onChange={handleLeaveStatusChange}
                label="Leave Status"
              >
                <MenuItem value={0}>Add</MenuItem>
                <MenuItem value={1}>Delete</MenuItem>
              </Select>
              {errors.transactionType && (
                <p className="text-red-500">{errors.transactionType.message}</p>
              )}
            </FormControl>
            <TextField
              id="days"
              label="Days"
              type="number" // Change type to "number"
              fullWidth
              error={!!errors.days}
              {...register("days", {
                required: "Number of days is required", // Add required validation
              })}
              inputProps={{
                inputMode: "numeric", // Set inputMode to "numeric" to show numeric keypad on mobile devices
              }}
              helperText={errors.days ? errors.days.message : null}
            />
            <TextField
              id="reason"
              label="Reason"
              fullWidth
              error={!!errors.reason}
              {...register("reason")}
              helperText={errors.reason ? errors.reason.message : null}
            />
            <div className="flex justify-center space-x-4">
              <MyButton type="submit">Submit</MyButton>

              <MyButton type="reset" onClick={handleModalClose}>
                Cancel
              </MyButton>
            </div>
          </form>
        </div>
      </Modal>
      <DatePickerModal
        isOpen={isModalOpenEligibility}
        handleClose={handleCloseModalEligibility}
        employeeDetails={employeeDetails}
      />
    </div>
  );
};

export default EmployeeDetails;
