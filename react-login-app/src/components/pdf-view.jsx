import React, { useState } from "react";
import usePdfView from "../hooks/use-pdf-view";

function PdfView() {
  const {
    pdf,
    isLoading,
    uploadError,
    viewError,
    uploadPdf,
    getPdf,
  } = usePdfView();
  const [file, setFile] = useState(null);
  const [pdfId, setPdfId] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const response = await uploadPdf(file);
      console.log(response); // Handle response if needed
    }
  };

  const handleView = () => {
    if (pdfId) {
      getPdf(1);
    }
  };

  return (
    <div className="App">
      <h1>Add pdf</h1>
      <header className="App-header">
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={isLoading}>
            Upload PDF
          </button>
          {uploadError && <p>Error: {uploadError}</p>}
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter PDF ID"
            value={pdfId || ""}
            onChange={(e) => setPdfId(e.target.value)}
          />
          <button onClick={handleView} disabled={isLoading}>
            View PDF
          </button>
          {viewError && <p>Error: {viewError}</p>}
          {isLoading && <p>Loading...</p>}
          {pdf && typeof pdf === 'string' && ( // Check if pdf is a string (Blob URL)
            <iframe src={pdf} width="100%" height="600px" title="PDF Viewer" />
          )}
        </div>
      </header>
    </div>
  );
}

export default PdfView;
