import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/use-auth";
import useLeaveTypes from "../../hooks/use-leave-type"; // Import the hook
import errorMessages from "../../services/errorMessages";
import useAddLeaveEmployee from "../../hooks/add-leave-employee";

function AddLeave() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { getUserDetails } = useAuth();
  const { id } = getUserDetails();
  const { leaveTypes, isLoading, error } = useLeaveTypes(); // Use the hook
  const { addLeaveEmployee, getTicketLeaveAvailablity } = useAddLeaveEmployee();
  const [ticketLeaveAvailability, setTicketLeaveAvailability] = useState(null);
  const schema = z.object({
    leaveType: z.string().min(1, { message: "Leave type is required" }),
    leaveFrom: z.date().refine((date) => date >= new Date(), {
      message: "Leave from date must be today or in the future",
    }),
    leaveTo: z.date().refine((date) => date >= new Date(), {
      message: "Leave to date must be today or in the future",
    }),
    remarks: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    const formData = {
      leaveType: parseInt(data.leaveType), // assuming leaveType is an ID
      from: startDate.toISOString().split("T")[0], // format date to YYYY-MM-DD
      to: endDate.toISOString().split("T")[0], // format date to YYYY-MM-DD
      user: id, // user ID from auth
      reason: data.remarks,
    };

    console.log(formData);

    try {
      const response = await addLeaveEmployee(formData);
      console.log(response);
      toast.success("Leave applied successfully");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errorCode
      ) {
        const errorMessage =
          errorMessages[error.response.data.errorCode] ||
          errorMessages["UNKNOWN_ERROR"];
        toast.error(errorMessage);
      } else {
        toast.error("Failed to add employee");
      }
    }
    // await addLeave(formData); // Use addLeave function from the hook
    // Add your logic for handling form submission
  };
  useEffect(() => {
    const fetchTicketLeaveAvailability = async () => {
      try {
        const response = await getTicketLeaveAvailablity();
        setTicketLeaveAvailability(response.eligible);

        // setEligibleApply(response.applyEligibility);
      } catch (error) {
        console.error("Failed to fetch ticket leave availability:", error);
      }
    };
    fetchTicketLeaveAvailability();
  }, [getTicketLeaveAvailablity]);
  return (
    <div className="container mx-auto mt-8 px-4">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Leave Type (Dropdown) */}
        <div>
          <label className="block mb-1 label">Leave Type</label>
          {isLoading ? (
            <p>Loading leave types...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <select
              name="leaveType"
              {...register("leaveType")}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes
                .filter(
                  (leaveType) => ticketLeaveAvailability || leaveType.id !== 1
                )
                .map((leaveType) => (
                  <option key={leaveType.id} value={leaveType.id}>
                    {leaveType.name}
                  </option>
                ))}
            </select>
          )}
          {errors.leaveType && (
            <p className="text-red-500">{errors.leaveType.message}</p>
          )}
        </div>

        {/* Leave From and Leave To (Datepickers) */}
        <div className="flex space-x-4">
          {/* Leave From */}
          <div className="flex-1">
            <label className="block mb-1 label">Leave From</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setValue("leaveFrom", date);
              }}
              dateFormat="dd/MM/yyyy"
              name="leaveFrom"
              showYearDropdown
              showMonthDropdown
              placeholderText="dd/MM/YYYY"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.leaveFrom && (
              <p className="text-red-500">{errors.leaveFrom.message}</p>
            )}
          </div>
          {/* Leave To */}
          <div className="flex-1">
            <label className="block mb-1 label">Leave To</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setValue("leaveTo", date);
              }}
              dateFormat="dd/MM/yyyy"
              name="leaveTo"
              showYearDropdown
              showMonthDropdown
              placeholderText="dd/MM/YYYY"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              minDate={startDate} // Set minDate for end date
            />
            {errors.leaveTo && (
              <p className="text-red-500">{errors.leaveTo.message}</p>
            )}
          </div>
        </div>

        {/* Remarks (Textfield) */}
        <div>
          <label className="block mb-1 label">Remarks</label>
          <textarea
            name="remarks"
            {...register("remarks")}
            placeholder="Remarks"
            rows="4"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          ></textarea>
          {errors.remarks && (
            <p className="text-red-500">{errors.remarks.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
          >
            Submit
          </button>
          <button
            type="reset"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full ml-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLeave;
