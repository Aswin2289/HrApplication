import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAddEmployee from "../hooks/use-add-employee";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import errorMessages from "../services/errorMessages";
function Addemployee() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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
    // license: z.string(),
    qualification: z.string(),
    role: z.string().min(1, { message: "Role is required" }),
    department: z.string().min(1, { message: "Department is required" }),
    prevExperience: z
      .string()
      .min(1, { message: "Pre Experience is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });

  const [employeeData, setEmployeeData] = useState({
    qidExpire: tomorrow,
    passportExpire: tomorrow,
    licenseExpire: null,
    joiningDate: today,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const handleQidExpireChange = (date) => {
    setEmployeeData({ ...employeeData, qidExpire: date });
  };

  const { addEmployee } = useAddEmployee();
  const onSubmit = async (data) => {
    if (data.gender === "male") {
      data.gender = 0;
    } else if (data.gender === "female") {
      data.gender = 1;
    }

    if (data.role === "HR") {
      data.role = 2;
    } else if (data.role === "Employee") {
      data.role = 3;
    }else if (data.role === "HOD") {
      data.role = 4;
    }

    data.qidExpire = employeeData.qidExpire;
    data.passportExpire = employeeData.passportExpire;
    data.licenseExpire = employeeData.licenseExpire;
    data.joiningDate = employeeData.joiningDate;
    delete data.confirmPassword;
    try {
      await addEmployee(data);
      toast.success("Employee added successfully");
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
  };

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      {/* <h2 className="text-2xl font-bold mb-4">Add Employee</h2> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block mb-1 label">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                {...register("employeeId")}
                required
                placeholder="Employee ID"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.employeeId && (
                <p className="text-red-500">{errors.employeeId.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">QID</label>
              <input
                type="text"
                name="qid"
                {...register("qid")}
                required
                placeholder="QID"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.qid && (
                <p className="text-red-500">{errors.qid.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">QID Expire</label>
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
            </div>
          </div>
          <div>
            <label className="block mb-1 label">Name</label>
            <input
              type="text"
              name="name"
              {...register("name")}
              required
              placeholder="Name"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 label">Nationality</label>
            <input
              type="text"
              name="nationality"
              {...register("nationality")}
              placeholder="Nationality"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block mb-1 label">Gender</label>
              <select
                name="gender"
                {...register("gender")}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                {...register("jobTitle")}
                placeholder="Job Title"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.jobTitle && (
                <p className="text-red-500">{errors.jobTitle.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">Experience</label>
              <input
                type="text"
                name="experience"
                {...register("experience")}
                placeholder="Experience"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.experience && (
                <p className="text-red-500">{errors.experience.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 label">Contract Period</label>
            <input
              type="text"
              name="contractPeriod"
              {...register("contractPeriod", {
                required: "Contract Period is required",
              })}
              placeholder="Contract Period"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.contractPeriod && (
              <p className="text-red-500">{errors.contractPeriod.message}</p>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block mb-1 label">Passport Number</label>
              <input
                type="text"
                name="passport"
                {...register("passport", {
                  required: "Passport Number is required",
                })}
                placeholder="Passport Number"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.passport && (
                <p className="text-red-500">{errors.passport.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">Passport Expire</label>
              <DatePicker
                selected={employeeData.passportExpire}
                onChange={(date) =>
                  setEmployeeData({ ...employeeData, passportExpire: date })
                }
                dateFormat="dd/MM/yyyy"
                name="passportExpire"
                showYearDropdown
                showMonthDropdown
                minDate={tomorrow}
                placeholderText="dd/MM/YYYY"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.passportExpire && (
                <p className="text-red-500">{errors.passportExpire.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block mb-1 label">License</label>
              <input
                type="text"
                name="license"
                {...register("license")}
                placeholder="License"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 label">License Expire</label>

              <DatePicker
                selected={employeeData.licenseExpire}
                onChange={(date) =>
                  setEmployeeData({ ...employeeData, licenseExpire: date })
                }
                dateFormat="dd/MM/yyyy"
                name="licenseExpire"
                showYearDropdown
                showMonthDropdown
                minDate={tomorrow}
                placeholderText="dd/MM/YYYY"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* New field: Qualification */}
            <div className="flex-1">
              <label className="block mb-1 label">Qualification</label>
              <input
                type="text"
                name="qualification"
                {...register("qualification")}
                placeholder="Qualification"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.qualification && (
                <p className="text-red-500">{errors.qualification.message}</p>
              )}
            </div>

            {/* New field: Role */}
            <div className="flex-1">
              <label className="block mb-1 label">Role</label>
              <select
                name="role"
                {...register("role")}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="">Select Role</option>
                <option value="HR">HR</option>
                <option value="Employee">Employee</option>
                <option value="HOD">Employee</option>
              </select>
              {errors.role && (
                <p className="text-red-500">{errors.role.message}</p>
              )}
            </div>
            {/* New field: Joining Date */}
            <div className="flex-1">
              <label className="block mb-1 label">Joining Date</label>
              <DatePicker
                selected={employeeData.joiningDate}
                onChange={(date) =>
                  setEmployeeData({ ...employeeData, joiningDate: date })
                }
                dateFormat="dd/MM/yyyy"
                name="joiningDate"
                showYearDropdown
                showMonthDropdown
                // minDate={tomorrow}
                placeholderText="dd/MM/YYYY"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.joiningDate && (
                <p className="text-red-500">{errors.joiningDate.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Department field taking 50% width */}
            <div className="flex-1 md:w-1/2">
              <label className="block mb-1 label">Department</label>
              <select
                name="department"
                {...register("department")}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="">Select department</option>
                <option value="0">Office</option>
                <option value="1">Production</option>
              </select>
              {errors.department && (
                <p className="text-red-500">{errors.department.message}</p>
              )}
            </div>
            {/* Pre Experience field taking 50% width */}
            <div className="flex-1 md:w-1/2">
              <label className="block mb-1 label">Pre Experience</label>
              <input
                type="text"
                name="prevExperience"
                {...register("prevExperience")}
                placeholder="Pre Experience"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.prevExperience && (
                <p className="text-red-500">{errors.prevExperience.message}</p>
              )}
            </div>
          </div>
          {/* New field: Password */}
          <div>
            <label className="block mb-1 label">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              {...register("password")}
              placeholder="Password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {/* New field: Confirm Password */}
          <div>
            <label className="block mb-1 label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
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

export default Addemployee;
