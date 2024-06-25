import { useState, useEffect } from "react";
import { axiosInstance } from "../services/interceptor";

const useEmployeeDetails = (employeeId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/user/details/${employeeId}`);
        console.log("---",response.data);
        setEmployeeDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch employee details");
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  return { employeeDetails, isLoading, error };
};

export default useEmployeeDetails;
