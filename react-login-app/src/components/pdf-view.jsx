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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const schema = z.object({
  documentName: z.string().min(1, "Document name is required"),
  documentExpire: z
    .date({
      required_error: "Document expire date is required",
      invalid_type_error: "Invalid date",
    })
    .nullable()
    .optional(),
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
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();

  useEffect(() => {
    fetchPdfList(searchKeyword);
  }, [searchKeyword]);

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
        setValue("documentExpire", selectedPdf.documentExpire);
      }
    } else {
      reset();
      setValue("documentName", "");
      setValue("documentExpire", "");
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
        const response = await uploadPdf(
          file,
          data.documentName,
          data.documentExpire
        );
        console.log(response); // Handle response if needed
      } else {
        const response = await updatePdf(
          selectedDocumentId,
          file,
          data.documentName,
          data.documentExpire
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
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };
  const toggleSearch = () => {
    setSearchKeyword(""); // Reset searchKeyword to empty string
    setSearchOpen(searchOpen); // Toggle searchOpen state
  };

  return (
    <div>
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />

      <div className="flex justify-end">
        {/* Search Icon */}
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 48 48"
          id="search"
          onClick={toggleSearch} // Toggle search bar visibility on click
          className="cursor-pointer"
        >
          <path d="M46.599 40.236L36.054 29.691C37.89 26.718 39 23.25 39 19.5 39 8.73 30.27 0 19.5 0S0 8.73 0 19.5 8.73 39 19.5 39c3.75 0 7.218-1.11 10.188-2.943l10.548 10.545a4.501 4.501 0 0 0 6.363-6.366zM19.5 33C12.045 33 6 26.955 6 19.5S12.045 6 19.5 6 33 12.045 33 19.5 26.955 33 19.5 33z"></path>
        </svg> */}
      </div>
      {searchOpen && (
        <div className="flex justify-end gap-5 mr-8 mt-2 mb-3 ml-6">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchKeyword}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-2 py-1 w-full h-14" // Reduced width of the search bar
          />
          {/* Close Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="cursor-pointer mt-1"
            onClick={toggleSearch} // Toggle search bar visibility on click
          >
            <path
              fill="currentColor"
              d="M19.71 19.71c-.39.39-1.02.39-1.41 0L12 13.41l-6.29 6.3c-.39.39-1.02.39-1.41 0s-.39-1.02 0-1.41L10.59 12 4.3 5.71c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0L12 10.59l6.29-6.3c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41L13.41 12l6.3 6.29c.39.39.39 1.03 0 1.42z"
            ></path>
          </svg>
        </div>
      )}
      {role !== 5 && role !== 4 && (
        <div className="flex justify-start mb-8 ml-6">
          <MyButton onClick={() => handleModalOpen()} disabled={isViewLoading}>
            Add Document
          </MyButton>
          {uploadError && <p className="text-red-500">Error: {uploadError}</p>}
        </div>
      )}
      {pdfList !== null && pdfList.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center gap-20">
          {pdfList.map((pdfDoc) => (
            <CertificateCard
              key={pdfDoc.id}
              logoSrc="https://via.placeholder.com/100"
              onClickView={() => handleView(pdfDoc.id)}
              documentName={pdfDoc.documentName}
              documentExpire={pdfDoc.documentExpire}
              onEdit={() => handleEdit(pdfDoc.id)}
              onDelete={() => handleDelete(pdfDoc.id)}
            />
          ))}

          {viewError && <p className="text-red-500">Error: {viewError}</p>}
          {isViewLoading && <p>Loading...</p>}
        </div>
      ) : (
        <p>No documents found.</p>
      )}
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

            <div className="flex-1">
              <label className="block mb-1 label">Document Expire Date</label>

              <DatePicker
                selected={watch("documentExpire")}
                onChange={(date) => setValue("documentExpire", date)} // Pass Date object
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                placeholderText="dd/MM/yyyy"
                className={`border border-gray-300 rounded px-3 py-2 w-full ${
                  errors.documentExpire ? "border-red-500" : ""
                }`}
              />
              {errors.documentExpire && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.documentExpire.message}
                </p>
              )}
            </div>

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
