import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Lottie from "lottie-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import addChangePasswordAnnimation from "../../profile/passwordgif.json";
import useAddEmployee from "../../hooks/use-add-employee";
import useAuth from "../../hooks/use-auth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define the validation schema
const schema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(1, { message: "New password is required" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
});

function ChangePassword() {
  const { getUserDetails } = useAuth();
  const { userId } = getUserDetails();
  const { changePassword } = useAddEmployee();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const response = await changePassword(userId, data);
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      toast.error("Error changing password");
    }
  };

  return (
    <div className="w-full h-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mt-6">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      {/* Left column */}
      <div className="w-full md:w-1/2 p-8 bg-red-100 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 mt-9">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-10 w-full">
          <div className="mb-4 w-full relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              {...register("currentPassword")}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2"
            >
              <FontAwesomeIcon className="mt-4 text-gray-600" icon={showCurrentPassword ? faEyeSlash : faEye} />
            </button>
            {errors.currentPassword && (
              <p className="text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="mb-4 w-full relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              {...register("newPassword")}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2"
            >
              <FontAwesomeIcon className="mt-4 text-gray-600" icon={showNewPassword ? faEyeSlash : faEye} />
            </button>
            {errors.newPassword && (
              <p className="text-red-500">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="mb-4 w-full relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              // onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2"
            >
              {/* <FontAwesomeIcon className="mt-4" icon={showConfirmPassword ? faEyeSlash : faEye} /> */}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
      {/* Right column */}
      <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-6 mt-16">Welcome Back!</h2>
        <p className="text-gray-600 text-center">
          Make sure your password is strong and unique to protect your account.
        </p>
        <div className="w-full">
          <Lottie animationData={addChangePasswordAnnimation} loop={true} />
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
