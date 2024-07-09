import useVehicleDocument from "../hooks/use-vehicle-document";
import CertificateCard from "./Certificatecard/CertificateCard";
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MyButton from "./Button/my-button";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const VehicleDocumentView = ({ vehicleId }) => {
  const {
    pdfList,
    isViewLoading,
    viewError,
    fetchPdfList,
    uploadPdf,
    getPdf,
    deletePdf,
    updatePdf,
  } = useVehicleDocument();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (vehicleId) {
      fetchPdfList(vehicleId);
    }
  }, [vehicleId]);

  const handleAddNewDocument = () => {
    setSelectedDocumentId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setFile(null);
    fetchPdfList(vehicleId);
    setIsModalOpen(false);
  };
  const handleModalOpen = (id = null) => {
    setIsModalOpen(true);
    setSelectedDocumentId(id);
    if (id) {
      const selectedPdf = pdfList.find((pdf) => pdf.id === id);
      if (selectedPdf) {
        setValue("documentName", selectedPdf.documentName);
      }
    } else {
      reset();
      setValue("documentName", "");
    }
  };

  const onSubmit = async (data) => {
    // Handle form submission logic
    try {
      if (selectedDocumentId === null) {
        await uploadPdf(file, data.documentName, vehicleId);
        toast.success("Document saved successfully");
      } else {
        const response = await updatePdf(
          selectedDocumentId,
          file,
          data.documentName
        );
        console.log(response); // Handle response if needed
        toast.success("Document updated successfully");
      }
      fetchPdfList(vehicleId); // Fetch the updated list of PDF documents
      handleModalClose();
    } catch (error) {
      toast.error("Failed to save document");
      console.error("Failed to save document:", error);
    }
    console.log("Form data", data);

    handleModalClose();
  };

  const handleFileChange = (e) => {
    // Handle file input change logic
    setFile(e.target.files[0]);
    console.log("File selected", e.target.files[0]);
  };

  const handleView = async (id) => {
    try {
      const pdf = await getPdf(id);
      console.log("Fetched PDF data:", pdf);

      if (pdf.data) {
        const blob = new Blob(
          [Uint8Array.from(atob(pdf.data), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, "_blank");
        if (!newTab) {
          throw new Error(
            "Failed to open PDF in new tab. Please allow popups for this site."
          );
        }
      } else {
        console.error("PDF data is empty or invalid:", pdf);
        toast.error(
          "Failed to load PDF document. PDF data is empty or invalid."
        );
      }
    } catch (error) {
      console.error("Failed to fetch or open PDF:", error);
      toast.error("Failed to load PDF document. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePdf(id);
      toast.success("Document deleted successfully");
      fetchPdfList(vehicleId); // Fetch the updated list of PDF documents
    } catch (error) {
      toast.error("Failed to delete document");
      console.error("Failed to delete document:", error);
    }
  };
  

  const handleEdit = (id) => {
    handleModalOpen(id);
  };

  const handleDownload = async (id) => {
    try {
      const pdf = await getPdf(id); // Fetch PDF data
      const blob = new Blob(
        [Uint8Array.from(atob(pdf.data), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${pdf.documentName}.pdf`; // Set the filename dynamically if available
      anchor.click();

      // Clean up resources
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF. Please try again later.");
    }
  };
  return (
    <div className="flex justify-center items-center bg-gray-100 mt-5">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 flex flex-col md:flex-row w-full md:max-w-4/5 lg:max-w-3/4 xl:max-w-2/3">
        <div className="flex flex-wrap justify-center items-center gap-20">
          <div className="bg-gray-100 p-5 rounded-lg text-center w-52 m-5 h-auto flex flex-col justify-center items-center transition duration-300 border border-gray-100 hover:border-gray-300 hover:shadow-md">
            <IconButton
              onClick={handleAddNewDocument}
              className="w-36 h-40 mx-auto rounded-full bg-red-900 text-white hover:bg-red-900 focus:outline-none focus:ring-1 focus:ring-red-900"
            >
              <AddIcon style={{ fontSize: 40, color: "#cf0404" }} />
            </IconButton>
            <h3 className="text-lg font-bold mt-4">New Document</h3>
          </div>
          {pdfList.map((pdfDoc) => (
            <CertificateCard
              key={pdfDoc.id}
              logoSrc="https://via.placeholder.com/100"
              documentName={pdfDoc.documentName}
              onEdit={() => handleEdit(pdfDoc.id)}
              onDelete={() => handleDelete(pdfDoc.id)}
              onClickView={() => handleView(pdfDoc.id)}
              onDownload={() => handleDownload(pdfDoc.id)}
            />
          ))}
          {viewError && <p className="text-red-500">Error: {viewError}</p>}
          {isViewLoading && <p>Loading...</p>}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="add-document-modal-title"
        aria-describedby="add-document-modal-description"
        className="flex justify-center items-center"
      >
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 id="add-document-modal-title" className="text-2xl font-bold mb-4">
            {selectedDocumentId === null ? "Add Document" : "Edit Document"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextField
              id="document-name"
              label="Document Name"
              fullWidth
              error={!!errors.documentName}
              //   InputLabelProps={{ shrink: true }}
              {...register("documentName")}
              helperText={
                errors.documentName ? errors.documentName.message : null
              }
            />
            <TextField
              type="file"
              id="file"
              fullWidth
              onChange={handleFileChange}
              error={!!errors.file}
              helperText={errors.file ? "Please upload a file" : null}
            />
            <div className="flex justify-center space-x-4">
              <MyButton type="submit">Submit</MyButton>
              <MyButton type="reset" onClick={handleModalClose}>
                Cancel
              </MyButton>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default VehicleDocumentView;
