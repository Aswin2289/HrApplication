import { axiosInstance,axiosInstance1 } from "../services/interceptor";
import { useMemo } from "react";

const useAddVehicle = () => {
  const addVehicle = async (vehicleData) => {
    try {
      console.log("---->",vehicleData.registrationDate);
      const response = await axiosInstance.post("/vehicle/add", vehicleData);
      console.log("Vehicle Added:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding vehicle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  const updateVehicle = async (id,vehicleData) => {
    try {
      const response = await axiosInstance.put(`/vehicle/update/${id}`, vehicleData);
      console.log("Vehicle Added:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding vehicle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const deleteVehicle = async (id) => {
    console.log("deleteVehicle", id);

    try {
      const response = await axiosInstance.put(`/vehicle/delete/${id}`);
      console.log("Vehicle Deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting vehicle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  const assignVehicle = async (id, userId) => {
    console.log("assignVehicle", id, userId);

    try {
      const response = await axiosInstance.put(`/vehicle/assign/${id}`, null, {
        params: { userId }, // Set page, size, and searchKeyword as query parameters
      });
      console.log("Vehicle Assigned:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error assigning vehicle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  const removeAssignee = async (id) => {
    console.log("removeAssignee", id);

    try {
      const response = await axiosInstance.put(`/vehicle/assign/remove/${id}`);
      console.log("Vehicle Assigned:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error assigning vehicle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const getVehicleDetails = async (id) => {
    console.log("getVehicleDetails", id);

    try {
      const response = await axiosInstance.get(`/vehicle/detail/${id}`);
      console.log("Vehicle Details:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error getting vehicle details:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return useMemo(
    () => ({
      deleteVehicle,
      assignVehicle,
      removeAssignee,
      getVehicleDetails,
      addVehicle,
      updateVehicle
    }),
    []
  );
};

export default useAddVehicle;
