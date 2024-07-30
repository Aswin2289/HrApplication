import { useState, useEffect } from "react";
import { axiosInstance } from "../services/interceptor";

const useLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypesHr, setLeaveTypesHr] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/leave/type/get");
        setLeaveTypes(response.data);
      } catch (error) {
        setError("Failed to fetch leave types");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    const fetchLeaveTypesHr = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/leave/type/getHr");
        setLeaveTypesHr(response.data);
      } catch (error) {
        setError("Failed to fetch leave types");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaveTypesHr();
  }, []);

    
  

  const addLeave = async (data) => {
    console.log("adding leave",data);
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/leave/hr/add", data);
      console.log(response.data);
      // Handle response if necessary
    } catch (error) {
      setError("Failed to add leave");
    } finally {
      setIsLoading(false);
    }
  };


  return { leaveTypes, isLoading, error, addLeave,leaveTypesHr };
};

export default useLeaveTypes;
