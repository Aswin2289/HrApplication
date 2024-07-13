import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAddEmployee from "../hooks/use-add-employee";
import useEmployeeDetails from "../hooks/useEmployeeDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import errorMessages from "../services/errorMessages";
import { useNavigate } from "react-router-dom";
import useUpdateEmployee from "../hooks/use-update-employee";
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import MyButton from "./Button/my-button";

const GenderEnum = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

const genderOptions = Object.keys(GenderEnum).map((key) => ({
  value: GenderEnum[key],
  label: key.charAt(0) + key.slice(1).toLowerCase(),
}));

const roleOptions = [
  { value: "employee", label: "Employee", id: 3 },
  { value: "HR", label: "HR", id: 2 },
  { value: "HOD", label: "HOD", id: 4 },
];

function UpdateModal({ show, handleClose, employeeId }) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const schema = z.object({
    employeeId: z.string().min(1, { message: "Employee ID is required" }),
    qid: z.string().min(1, { message: "QID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    nationality: z.string(),
    gender: z.string().min(1, { message: "Gender is required" }),
    jobTitle: z.string().min(1, { message: "Job Title is required" }),
    experience: z.string().min(1, { message: "Experience is required" }),
    contractPeriod: z
      .string()
      .min(1, { message: "Contract Period is required" }),
    passport: z.string().min(1, { message: "Passport Number is required" }),
    license: z.string(),
    qualification: z.string(),
    role: z.number().min(1, { message: "Role is required" }),
    department: z.string().min(1, { message: "Department is required" }),
    prevExperience: z
      .string()
      .min(1, { message: "Previous Experience is required" }),
  });

  const [employeeData, setEmployeeData] = useState({
    qidExpire: tomorrow,
    passportExpire: tomorrow,
    licenseExpire: tomorrow,
    joiningDate: today,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const handleQidExpireChange = (date) => {
    setEmployeeData({ ...employeeData, qidExpire: date });
  };

  const handlePassportExpireChange = (date) => {
    setEmployeeData({ ...employeeData, passportExpire: date });
  };

  const handleLicenseExpireChange = (date) => {
    setEmployeeData({ ...employeeData, licenseExpire: date });
  };

  const handleJoiningDateChange = (date) => {
    setEmployeeData({ ...employeeData, joiningDate: date });
  };

  const { updateEmployee } = useUpdateEmployee();
  const { employeeDetails, isLoading, error } = useEmployeeDetails(employeeId);

  useEffect(() => {
    if (employeeDetails) {
      // Populate form fields with employeeDetails
      setValue("employeeId", employeeDetails.employeeId);
      setValue("qid", employeeDetails.qid);
      setValue("name", employeeDetails.name);
      setValue("nationality", employeeDetails.nationality);
      setValue("gender", mapGenderValueToString(employeeDetails.gender)); // Ensure this line is setting the correct value
      setValue("jobTitle", employeeDetails.jobTitle);
      setValue("experience", employeeDetails.experience);
      setValue("contractPeriod", employeeDetails.contractPeriod);
      setValue("passport", employeeDetails.passport);
      setValue("license", employeeDetails.license);
      setValue("qualification", employeeDetails.qualification);
      setValue("role", mapRoleStringToValue(employeeDetails.role));
      setValue("department", employeeDetails.department);
      setValue("prevExperience", employeeDetails.prevExperience);

      // Set date fields
      setEmployeeData({
        qidExpire: new Date(
          employeeDetails.qidExpire[0],
          employeeDetails.qidExpire[1] - 1,
          employeeDetails.qidExpire[2]
        ),
        passportExpire: new Date(
          employeeDetails.passportExpire[0],
          employeeDetails.passportExpire[1] - 1,
          employeeDetails.passportExpire[2]
        ),
        licenseExpire: new Date(
          employeeDetails.licenseExpire[0],
          employeeDetails.licenseExpire[1] - 1,
          employeeDetails.licenseExpire[2]
        ),
        joiningDate: new Date(employeeDetails.joiningDate),
      });
    }
  }, [employeeDetails, setValue]);

  const mapGenderValueToString = (genderValue) => {
    switch (genderValue) {
      case 0:
        return GenderEnum.MALE;
      case 1:
        return GenderEnum.FEMALE;
      case 2:
        return GenderEnum.OTHER;
      default:
        return "";
    }
  };

  const mapGenderStringToValue = (genderString) => {
    switch (genderString) {
      case GenderEnum.MALE:
        return 0;
      case GenderEnum.FEMALE:
        return 1;
      case GenderEnum.OTHER:
        return 2;
      default:
        return null;
    }
  };
  const mapRoleStringToValue = (roleString) => {
    return (
      roleOptions.find((option) => option.value === roleString)?.id || null
    );
  };

  const onSubmit = async (data) => {
    data.gender = mapGenderStringToValue(data.gender);

    data.qidExpire = employeeData.qidExpire;
    data.passportExpire = employeeData.passportExpire;
    data.licenseExpire = employeeData.licenseExpire;
    data.joiningDate = employeeData.joiningDate;
    console.log("---->",data.gender);
    try {
      await updateEmployee(employeeId, data);
      toast.success("Employee updated successfully");
      handleClose(); // Close the modal after successful submission
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
        toast.error("Failed to update employee");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    reset();
    handleClose();
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-1/2 p-8">
          <Typography variant="h5" gutterBottom>
            Update Employee
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Employee ID"
                  variant="outlined"
                  fullWidth
                  {...register("employeeId")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.employeeId}
                  helperText={
                    errors.employeeId ? errors.employeeId.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="QID"
                  variant="outlined"
                  fullWidth
                  {...register("qid")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.qid}
                  helperText={errors.qid ? errors.qid.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>QID Expire</InputLabel>
                <DatePicker
                  selected={employeeData.qidExpire}
                  onChange={handleQidExpireChange}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  name="qidExpire"
                  minDate={tomorrow}
                  placeholderText="dd/MM/YYYY"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.qidExpire && (
                  <p className="text-red-500">{errors.qidExpire.message}</p>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...register("name")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Nationality"
                  variant="outlined"
                  fullWidth
                  {...register("nationality")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.nationality}
                  helperText={
                    errors.nationality ? errors.nationality.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    {...register("gender")}
                    value={getValues("gender") || ""}
                    onChange={(e) => setValue("gender", e.target.value)}
                    error={!!errors.gender}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500">{errors.gender.message}</p>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  {...register("jobTitle")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle ? errors.jobTitle.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Experience"
                  variant="outlined"
                  fullWidth
                  {...register("experience")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.experience}
                  helperText={
                    errors.experience ? errors.experience.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Contract Period"
                  variant="outlined"
                  fullWidth
                  {...register("contractPeriod")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.contractPeriod}
                  helperText={
                    errors.contractPeriod ? errors.contractPeriod.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Passport Number"
                  variant="outlined"
                  fullWidth
                  {...register("passport")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.passport}
                  helperText={errors.passport ? errors.passport.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Passport Expire</InputLabel>
                <DatePicker
                  selected={employeeData.passportExpire}
                  onChange={handlePassportExpireChange}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  name="passportExpire"
                  minDate={tomorrow}
                  placeholderText="dd/MM/YYYY"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.passportExpire && (
                  <p className="text-red-500">
                    {errors.passportExpire.message}
                  </p>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="License"
                  variant="outlined"
                  fullWidth
                  {...register("license")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.license}
                  helperText={errors.license ? errors.license.message : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>License Expire</InputLabel>
                <DatePicker
                  selected={employeeData.licenseExpire}
                  onChange={handleLicenseExpireChange}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  name="licenseExpire"
                  minDate={tomorrow}
                  placeholderText="dd/MM/YYYY"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.licenseExpire && (
                  <p className="text-red-500">{errors.licenseExpire.message}</p>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Qualification"
                  variant="outlined"
                  fullWidth
                  {...register("qualification")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.qualification}
                  helperText={
                    errors.qualification ? errors.qualification.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    {...register("role")}
                    value={getValues("role") || ""}
                    onChange={(e) => setValue("role", e.target.value)}
                    error={!!errors.role}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.role && (
                    <p className="text-red-500">{errors.role.message}</p>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  variant="outlined"
                  fullWidth
                  {...register("department")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.department}
                  helperText={
                    errors.department ? errors.department.message : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Joining Date</InputLabel>
                <DatePicker
                  selected={employeeData.joiningDate}
                  onChange={handleJoiningDateChange}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  name="joiningDate"
                  placeholderText="dd/MM/YYYY"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.joiningDate && (
                  <p className="text-red-500">{errors.joiningDate.message}</p>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Previous Experience"
                  variant="outlined"
                  fullWidth
                  {...register("prevExperience")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.prevExperience}
                  helperText={
                    errors.prevExperience ? errors.prevExperience.message : ""
                  }
                />
              </Grid>
            </Grid>
            <div className="flex justify-center space-x-4">
              <MyButton type="submit">Submit</MyButton>
              <MyButton type="reset" onClick={handleModalClose}>
                Cancel
              </MyButton>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </Modal>
  );
}

export default UpdateModal;
