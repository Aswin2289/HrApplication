import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyButton from "./Button/my-button";
import CircularProgress from "@mui/material/CircularProgress";
import useEmployeeDetails from "../hooks/useEmployeeDetails";
import useAddEmployee from "../hooks/use-add-employee";

// Define schema with Zod
const schema = z.object({
  lastEligilibleDate: z.date().refine((date) => date instanceof Date, {
    message: "Please enter a valid date",
  }),
});

const DatePickerModal = ({ isOpen, handleClose, employeeId }) => {
  console.log("inside datepicker",isOpen,employeeId);
  const [empId, setEmpId] = useState(employeeId);
  useEffect(() => {
    setEmpId(employeeId);
  }, [employeeId]);
  const { employeeDetails, isLoading, error } = useEmployeeDetails(empId);
  const { updateLastEligibility } = useAddEmployee();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      lastEligilibleDate: new Date(),
    },
  });

  const lastEligilibleDate = watch("lastEligilibleDate");

  useEffect(() => {
    if (isOpen) {
      reset({
        lastEligilibleDate: new Date(),
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data, e) => {
    try {
      const leaveData = {
        lastEligilibleDate: data.lastEligilibleDate,
      };
      console.log(leaveData);
      await updateLastEligibility(employeeId, leaveData);
      toast.success("Date selected successfully");
      e.target.reset();
    } catch (error) {
      toast.error("Failed to submit date:", error);
      console.error("Failed to submit date:", error);
    }
    handleClose();
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!employeeDetails) {
    return <div></div>;
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="date-picker-modal-title"
      aria-describedby="date-picker-modal-description"
      className="flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-lg w-1/4">
        <h2 id="date-picker-modal-title" className="text-2xl font-bold mb-4">
          Update The Last Eligibility Date
        </h2>
        <p className="text-gray-600 mb-4">
          Employee: {employeeDetails.name} ({employeeDetails.role})
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex-1">
            <label className="block mb-1 label">Select Date</label>
            <DatePicker
              selected={lastEligilibleDate}
              onChange={(date) => setValue("lastEligilibleDate", date)}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              showMonthDropdown
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.lastEligilibleDate && (
              <p className="text-red-500">{errors.lastEligilibleDate.message}</p>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <MyButton type="submit">Submit</MyButton>
            <MyButton type="reset" onClick={handleClose}>Cancel</MyButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
