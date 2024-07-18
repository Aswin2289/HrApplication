import React, { useState, useEffect } from "react";
import CertificateCard from "./Certificatecard/CertificateCard";
import usePdfView from "../hooks/use-pdf-view";
import {
  Modal,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyButton from "./Button/my-button";
import useAuth from "../hooks/use-auth";

const schema = z.object({
  documentName: z.string().min(1, "Document name is required"),
  file: z
    .object({
      name: z.string(),
      size: z.number(),
    })
    .nullable()
    .optional(),
});

const PdfView = () => {
  const {
    pdfList,
    isViewLoading,
    uploadError,
    viewError,
    uploadPdf,
    updatePdf,
    getPdf,
    fetchPdfList,
    deletePdf,
  } = usePdfView();
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();

  useEffect(() => {
    fetchPdfList();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDocumentId(null);
    setFile(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (selectedDocumentId === null) {
        const response = await uploadPdf(file, data.documentName);
        console.log(response); // Handle response if needed
      } else {
        const response = await updatePdf(
          selectedDocumentId,
          file,
          data.documentName
        );
        console.log(response); // Handle response if needed
      }
      toast.success("Document saved successfully");
      fetchPdfList(); // Fetch the updated list of PDF documents
      handleModalClose();
    } catch (error) {
      toast.error("Failed to save document");
      console.error("Failed to save document:", error);
    }
  };

  const handleView = async (id) => {
    try {
      const pdf = await getPdf(id);
      console.log(pdf); // Log the PDF data to debug
      setPdfData(pdf.data); // Set the PDF data state
    } catch (error) {
      console.error("Failed to fetch PDF:", error);
    }
  };

  const handleEdit = (id) => {
    handleModalOpen(id);
  };

  const handleDelete = async (id) => {
    try {
      await deletePdf(id);
      toast.success("Document deleted successfully");
      fetchPdfList(); // Fetch the updated list of PDF documents
    } catch (error) {
      toast.error("Failed to delete document");
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <div>
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      {role !== 5 && (
        <div className="flex justify-end mb-8">
          <MyButton onClick={() => handleModalOpen()} disabled={isViewLoading}>
            Add Document
          </MyButton>
          {uploadError && <p className="text-red-500">Error: {uploadError}</p>}
        </div>
      )}
      <div className="flex flex-wrap justify-center items-center gap-20">
        {pdfList.map((pdfDoc) => (
          <CertificateCard
            key={pdfDoc.id}
            logoSrc="https://via.placeholder.com/100"
            onClickView={() => handleView(pdfDoc.id)}
            documentName={pdfDoc.documentName}
            onEdit={() => handleEdit(pdfDoc.id)}
            onDelete={() => handleDelete(pdfDoc.id)}
          />
        ))}
        {viewError && <p className="text-red-500">Error: {viewError}</p>}
        {isViewLoading && <p>Loading...</p>}
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
            {selectedDocumentId === null && (
              <FormControl fullWidth error={!!errors.documentType}>
                <InputLabel id="document-type-label">Document Type</InputLabel>
                <Select
                  labelId="document-type-label"
                  id="document-type"
                  value={"addNew"}
                  onChange={(e) => handleModalOpen()}
                  label="Document Type"
                  disabled={true}
                >
                  <MenuItem value="addNew">Add New Document</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              id="document-name"
              label="Document Name"
              fullWidth
              error={!!errors.documentName}
              InputLabelProps={{ shrink: true }}
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

      {pdfData && (
        <Modal
          open={!!pdfData}
          onClose={() => setPdfData(null)}
          aria-labelledby="pdf-view-modal-title"
          aria-describedby="pdf-view-modal-description"
          className="flex justify-center items-center"
        >
          <Box className="bg-white p-8 rounded-lg w-full max-w-3xl">
            <h2 id="pdf-view-modal-title" className="text-2xl font-bold mb-4">
              View Document
            </h2>
            <object
              data={`data:application/pdf;base64,${pdfData}`}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Unable to display PDF file. This browser may not support
                embedded PDFs. Please download the file to view it:{" "}
                <a href={`data:application/pdf;base64,${pdfData}`}>
                  Download PDF
                </a>
                .
              </p>
            </object>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default PdfView;
