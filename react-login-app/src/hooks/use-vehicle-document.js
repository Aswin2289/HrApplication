import { useState } from "react";
import { axiosInstance } from "../services/interceptor";
const useVehicleDocument = () => {
  const [pdfList, setPdfList] = useState([]);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchPdfList = async (id) => {
    setIsViewLoading(true);
    try {
      const response = await axiosInstance.get(`/vehicle/document/all/${id}`);
      setPdfList(response.data);
      setIsViewLoading(false);
    } catch (error) {
      setIsViewLoading(false);
      setViewError(
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred while fetching the PDF list."
      );
    }
  };

  const uploadPdf = async (file, documentName, vehicleId) => {
    setIsUploadLoading(true);
    setUploadError(null);
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentName", documentName);
        formData.append("vehicleId", vehicleId);

        const response = await axiosInstance.post(
            "/vehicle/document/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        setIsUploadLoading(false);
        return response.data;
    } catch (error) {
        setIsUploadLoading(false);
        setUploadError(
            error.response && error.response.data
                ? error.response.data.message
                : "An error occurred while uploading the PDF."
        );
    }
};
  const getPdf = async (id) => {
    setIsViewLoading(true);
    try {
      const response = await axiosInstance.get(`/vehicle/document/view/${id}`);
      setIsViewLoading(false);
      return response.data;
    } catch (error) {
      setIsViewLoading(false);
      setViewError(
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred while fetching the PDF."
      );
    }
  };
  const deletePdf = async (id) => {
    setIsViewLoading(true);
    try {
      const response = await axiosInstance.put(`/vehicle/document/delete/${id}`);
      setIsViewLoading(false);
      console.log(isViewLoading);
      return response.data;
    } catch (error) {
      setIsViewLoading(false);
      console.log(viewError);
      setViewError(
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred while fetching the PDF."
      );
    }
  };

  const updatePdf = async (id, file, documentName) => {
    setIsUploadLoading(true);
    console.log(isUploadLoading);
    setUploadError(null);
    console.log("Uploading", id, documentName);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", documentName);

      const response = await axiosInstance.put(`/vehicle/document/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsUploadLoading(false);
      return response.data;
    } catch (error) {
      setIsUploadLoading(false);
      setUploadError(
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred while updating the PDF."
      );
      console.log(uploadError);
    }
  };


  return { pdfList, fetchPdfList, uploadPdf ,getPdf,deletePdf, updatePdf};
};
export default useVehicleDocument;
