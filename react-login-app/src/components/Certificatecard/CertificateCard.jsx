import React from "react";
import PropTypes from "prop-types";
import myImage from "../../profile/Download Pdf File.gif"
const CertificateCard = ({ logoSrc, documentName, onClickView }) => {
  return (
    <div className="bg-gray-300 p-5 rounded-lg text-center w-52 m-5">
      <div className="mb-4">
        {/* <img src={logoSrc} alt="Certificate Logo" className="w-24 h-24 mx-auto" /> */}
        <img src={myImage} alt="Certificate Logo" className="w-26 h-26 mx-auto" />

      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">{documentName}</h3> {/* Display document name */}
      </div>
      <button
        className="text-red-700 font-bold flex items-center justify-center space-x-1"
        onClick={onClickView}
      >
        <span className="flex justify-center">VIEW DOCUMENT</span>
        <span className="text-lg">↗</span>
      </button>
    </div>
  );
};

CertificateCard.propTypes = {
  logoSrc: PropTypes.string.isRequired,
  documentName: PropTypes.string.isRequired, // Add documentName to propTypes
  onClickView: PropTypes.func.isRequired,
};

export default CertificateCard;
