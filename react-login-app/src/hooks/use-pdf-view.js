import { useState } from "react";
import { axiosInstance } from "../services/interceptor"; // Ensure the correct path to axiosInstance

const usePdfView = () => {
  const [pdf, setPdf] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [viewError, setViewError] = useState(null);

  const uploadPdf = async (file) => {
    setIsUploadLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        "/pdfdocument/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsUploadLoading(false);
      return response.data; // Return response if needed
    } catch (error) {
      setIsUploadLoading(false);
      setUploadError(
        error.response && error.response.data ? error.response.data.message : "An error occurred while uploading the PDF."
      );
    }
  };

  const getPdf = async (id) => {
    setIsViewLoading(true);
    setViewError(null);

    try {
      const response = await axiosInstance.get(
        `/pdfdocument/view/${id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setPdf(url);
      setIsViewLoading(false);
    } catch (error) {
      setIsViewLoading(false);
      setViewError(
        error.response && error.response.data ? error.response.data.message : "An error occurred while fetching the PDF."
      );
    }
  };

  return {
    pdf,
    isUploadLoading,
    isViewLoading,
    uploadError,
    viewError,
    uploadPdf,
    getPdf,
  };
};

export default usePdfView;
