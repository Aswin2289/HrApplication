import { useState, useEffect } from "react";
import { axiosInstance } from "../services/interceptor";

const useTotalEmployees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTotalEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/user/totalEmployees");
        console.log(response.data);
        setTotalEmployees(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch total employees");
        setIsLoading(false);
      }
    };

    fetchTotalEmployees();
  }, []);

  return { totalEmployees, isLoading, error };
};

export default useTotalEmployees;
