import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import pdfLogo from "../../profile/Download Pdf File.gif";
const CertificateCard = ({
  logoSrc,
  documentName,
  onClickView,
  onEdit,
  onDelete,
}) => {
  const handleEdit = (event) => {
    event.stopPropagation(); // Prevent onClickView from triggering
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent onClickView from triggering
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg text-center w-52 m-5">
      <div className="mb-4">
        {/* Replace with your logo */}
        <img
          src={pdfLogo}
          alt="Certificate Logo"
          className="w-24 h-24 mx-auto"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">{documentName}</h3>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          className="text-red-700 font-bold flex items-center justify-center space-x-1"
          onClick={onClickView}
        >
          <span>VIEW DOCUMENT</span>
          <span className="text-lg">↗</span>
        </button>
      </div>

      <div style={{ display: "flex",alignItems:"center", justifyContent:"center", marginTop:"10px"}}>
        <IconButton onClick={handleEdit}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon style={{ fontSize: 20 }} />
        </IconButton>
      </div>
    </div>
  );
};

CertificateCard.propTypes = {
  logoSrc: PropTypes.string.isRequired,
  documentName: PropTypes.string.isRequired,
  onClickView: PropTypes.func.isRequired,
  onEdit: PropTypes.func, // Optional prop for edit functionality
  onDelete: PropTypes.func, // Optional prop for delete functionality
};

export default CertificateCard;
