import {  axiosInstance1 } from "../services/interceptor";
import { useMemo } from "react";

const useAddEmployeeImage = () => {
  const uploadImage = async (id, file) => {
    console.log("uploadImage", id, file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance1.put(
        `/user/upload/${id}`,
        formData
      );
      console.log("Vehicle Image Uploaded:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error uploading vehicle image:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  const viewImage = async (id) => {
    console.log("viewImage", id);

    try {
      const response = await axiosInstance1.get(`/user/viewImage/${id}`, {
        responseType: "blob", // Ensure the response is treated as a Blob
      });
      // console.log("Vehicle Image:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Error viewing vehicle image:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  return useMemo(
    () => ({
      uploadImage,
      viewImage,
    }),
    []
  );
};
export default useAddEmployeeImage;
