import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import pdfLogo from "../../profile/Download Pdf File.gif";
import useAuth from "../../hooks/use-auth";
const CertificateCard = ({
  logoSrc,
  documentName,
  onClickView,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const handleEdit = (event) => {
    event.stopPropagation(); // Prevent onClickView from triggering
    if (onEdit) {
      onEdit();
    }
  };
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent onClickView from triggering
    if (onDelete) {
      onDelete();
    }
  };
  const handleDownload = (event) => {
    event.stopPropagation(); // Prevent onClick
    if (onDownload) {
      onDownload();
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {role !== 5 && (
          <div>
            <IconButton onClick={handleEdit}>
              <EditIcon style={{ fontSize: 20 }} />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        )}
        <IconButton onClick={handleDownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 1792 1792"
          >
            <path d="M1344 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28H160q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zm-325-569q17 41-14 70l-448 448q-18 19-45 19t-45-19L403 621q-31-29-14-70 17-39 59-39h256V64q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z"></path>
          </svg>
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
  onDownload: PropTypes.func, // Optional prop for delete functionality
};

export default CertificateCard;
