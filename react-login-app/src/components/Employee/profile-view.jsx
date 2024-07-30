import React, { useState } from "react";
import useAuth from "../../hooks/use-auth";
import useEmployeeDetails from "../../hooks/useEmployeeDetails";
import { ToastContainer, toast } from "react-toastify";
import Lottie from "lottie-react";
import addEditIcon from "../../profile/edit.json";
import UpdateModal from "../update-modal";
function ProfileView() {
  const { getUserDetails } = useAuth();
  const { userId, role } = getUserDetails();
  const { employeeDetails, refetch } = useEmployeeDetails(userId);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  if (!employeeDetails) {
    return <div>No employee details found.</div>;
  }
  const handleEditClick = (id) => {
    console.error("Invalid ID provided:", id);
    if (id !== null && id !== undefined) {
      handleShowModal(id);
    } else {
      console.error("Invalid ID provided:", id);
    }
  };
  const handleShowModal = (employeeId) => {
    console.error("Invalid ID provided:", employeeId);
    if (employeeId !== null && employeeId !== undefined) {
      setSelectedEmployeeId(employeeId);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    refetch();
    setSelectedEmployeeId(null); // Reset selected employee ID when closing modal

    // refetch the employee details after update
  };
  return (
    <div className="flex justify-center items-center bg-gray-100 mt-5">
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 flex flex-col md:flex-row w-full md:max-w-4/5 lg:max-w-3/4 xl:max-w-2/3">
        <div className="w-full md:w-2/3 md:pr-6">
          <h2 className="flex gap-3 text-3xl font-bold mb-4">
            {employeeDetails.name}{" "}
            {role !== 3 && (
              <span className="mt-3 w-5 h-5 cursor-pointer">
                <Lottie
                  animationData={addEditIcon}
                  onClick={() => handleEditClick(userId)}
                  loop={true}
                />
              </span>
            )}
          </h2>
          <span
            className={`${
              employeeDetails.status === 1
                ? "bg-green-500 text-white rounded-md p-1"
                : "bg-red-500 text-white rounded-md p-1"
            } font-normal text-sm2`}
          >
            {employeeDetails.status === 1 ? "On Premises" : "Vacation"}
          </span>
          <p className="text-gray-600 mb-4 mt-3">{employeeDetails.role}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">QID:</span>
              <span>{employeeDetails.qid}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Employee ID:</span>
              <span>{employeeDetails.employeeId}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Job Title:</span>
              <span>{employeeDetails.jobTitle}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Nationality:</span>
              <span>{employeeDetails.nationality}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Gender:</span>
              <span>{employeeDetails.gender === 0 ? "Male" : "Female"}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Contract Period:</span>
              <span>{employeeDetails.contractPeriod} months</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Passport No:</span>
              <span>{employeeDetails.passport}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Qualification:</span>
              <span>{employeeDetails.qualification}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Experience:</span>
              <span>{employeeDetails.experience} years</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Total Experience:</span>
              <span>{employeeDetails.totalExperience} years</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Joining Date:</span>
              <span>
                {new Date(employeeDetails.joiningDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">QID Expire:</span>
              <span>
                {employeeDetails.qidExpire.join("-")},{" "}
                <span className="font-extrabold text-red-800">
                  {employeeDetails.noOfDaysQidExpire}
                </span>{" "}
                days left
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">Passport Expire:</span>
              <span>
                {employeeDetails.passportExpire.join("-")},{" "}
                <span className="font-extrabold text-red-800">
                  {employeeDetails.noOfDaysPassportExpire}
                </span>{" "}
                days left
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-gray-700 font-bold">License Expire:</span>
              <span>
                {employeeDetails.licenseExpire
                  ? `${employeeDetails.licenseExpire.join("-")}, `
                  : "N/A"}{" "}
                {employeeDetails.licenseExpire && (
                  <span className="font-extrabold text-red-800">
                    {employeeDetails.noOfDaysLicenseExpire} days left
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-between items-center">
          <img
            src="https://via.placeholder.com/150"
            alt=""
            className="rounded-full shadow-lg"
          />
        </div>
      </div>
      <UpdateModal
        show={showModal}
        handleClose={handleCloseModal}
        employeeId={selectedEmployeeId}
      />
    </div>
  );
}
export default ProfileView;
