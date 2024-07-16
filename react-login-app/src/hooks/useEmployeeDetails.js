import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../services/interceptor";

const useEmployeeDetails = (employeeId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchEmployeeDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/user/details/${employeeId}`);
      setEmployeeDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch employee details");
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId, fetchEmployeeDetails]);

  return { employeeDetails, isLoading, error, refetch: fetchEmployeeDetails };
};

export default useEmployeeDetails;
