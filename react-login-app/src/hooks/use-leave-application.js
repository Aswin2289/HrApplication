import { axiosInstance } from "../services/interceptor";
import { useState } from "react";
const useLeaveApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorRes, setError] = useState(null);
  const applyLeaveApplication = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/leaveApplication/add", data);
      setIsLoading(false);
      console.log(isLoading);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data);

      return errorRes;
    }
  };

  return { applyLeaveApplication };
};
export default useLeaveApplication;
