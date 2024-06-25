import { useState } from "react";
import { axiosInstance } from "../services/interceptor";
const useDeleteEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEmployee = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/user/delete/${id}`);
      setIsLoading(false);
      return response.data; // Return the response data if successful
    } catch (error) {
      setIsLoading(false);
      setError("Failed to delete employee");
      throw new Error("Failed to delete employee");
    }
  };

  const deleteLeaveApplication = async (id) => {
    try{
      const response = await axiosInstance.put(`/leaveApplication/delete/${id}`);
      return response.data;

    }catch(error){
      setError("Failed to delete leave application");
      throw new Error("Failed to delete leave application");
    }
  };

  return { deleteEmployee, isLoading, error,deleteLeaveApplication };
};

export default useDeleteEmployee;
