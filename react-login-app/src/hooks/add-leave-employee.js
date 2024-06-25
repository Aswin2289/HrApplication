import { axiosInstance } from "../services/interceptor";
import { useMemo } from 'react';

const useAddLeaveEmployee = () => {
  const addLeaveEmployee = async (data) => {
    try {
      const response = await axiosInstance.post(`/leave/add`, data);
      console.log("Add Leave Employee Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding leave:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const getLeaveCountEmployee = async () => {
    try {
      const response = await axiosInstance.get(`/leave/count`);
      console.log("Leave Count Employee Response:", response.data.body);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave count:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const getTicketLeaveAvailablity = async () => {
    try {
      const response = await axiosInstance.get(`/leave/availability`);
      console.log("Ticket Leave Availability Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket leave availability:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  const getYearEligiblity = async () => {
    try {
      const response = await axiosInstance.get(`/leave/eligibility`);
      console.log(" Availability Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(' leave availability:', error.response ? error.response.data : error.message);
      throw error;
    }
  };


  return useMemo(() => ({
    addLeaveEmployee,
    getLeaveCountEmployee,
    getTicketLeaveAvailablity,
    getYearEligiblity,
  }), []);
};

export default useAddLeaveEmployee;
