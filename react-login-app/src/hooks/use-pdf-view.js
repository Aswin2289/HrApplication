import { useState } from "react";
import { axiosInstance } from "../services/interceptor";

const usePdfView = () => {
  const [pdfList, setPdfList] = useState([]);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [viewError, setViewError] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const fetchPdfList = async (searchKeyword = "") => {
    setIsViewLoading(true);
    try {
      const response = await axiosInstance.get("/pdfdocument/all", {
        params: { searchKeyword },
      });
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

  const uploadPdf = async (file, documentName, documentExpire) => {
    setIsUploadLoading(true);
    setUploadError(null);
    const formattedDate =
      documentExpire.getFullYear() +
      "-" +
      String(documentExpire.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(documentExpire.getDate()).padStart(2, "0");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", documentName);
      formData.append("documentExpire", formattedDate);

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

  const updatePdf = async (id, file, documentName,documentExpire) => {
    setIsUploadLoading(true);
    setUploadError(null);
    const formattedDate =
    documentExpire.getFullYear() +
    "-" +
    String(documentExpire.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(documentExpire.getDate()).padStart(2, "0");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", documentName);
      formData.append("documentExpire", formattedDate);

      const response = await axiosInstance.put(
        `/pdfdocument/update/${id}`,
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
          : "An error occurred while updating the PDF."
      );
      console.log(isUploadLoading);
    }
  };

  const getPdf = async (id) => {
    setIsViewLoading(true);
    try {
      const response = await axiosInstance.get(`/pdfdocument/view/${id}`);
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
      const response = await axiosInstance.put(`/pdfdocument/delete/${id}`);
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

  return {
    pdfList,
    isViewLoading,
    uploadError,
    viewError,
    uploadPdf,
    updatePdf,
    getPdf,
    fetchPdfList,
    deletePdf,
  };
};

export default usePdfView;
