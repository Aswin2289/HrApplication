import { useState } from "react";
import axios from "axios";

const usePdfView = () => {
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [viewError, setViewError] = useState(null);

  const uploadPdf = async (file) => {
    setIsLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8080/api/v1/pdfdocument/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      return response.data; // Return response if needed
    } catch (error) {
      setIsLoading(false);
      setUploadError(
        error.response ? error.response.data : "An error occurred"
      );
    }
  };

  const getPdf = async (id) => {
    setIsLoading(true);
    setViewError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/pdfdocument/view/${id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setPdf(url);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setViewError(
        error.response ? error.response.data : "An error occurred"
      );
    }
  };

  return { pdf, isLoading, uploadError, viewError, uploadPdf, getPdf };
};

export default usePdfView;
