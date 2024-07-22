import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAddVehicle from "../hooks/use-add-vehicle";
import MyButton from "./Button/my-button";
import "tailwindcss/tailwind.css";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../services/interceptor";
import VehicleDocumentView from "./vehicle-document-view";
import useAuth from "../hooks/use-auth";
import { differenceInYears, differenceInMonths, format } from "date-fns";
const schema = z.object({
  assignUser: z.string().min(1, "User is required"),
});

const VehicleDetail = () => {
  const location = useLocation();
  const { vehicleId } = location.state;
  const {
    getVehicleDetails,
    assignVehicle,
    removeAssignee,
    uploadImage,
    viewImage,
  } = useAddVehicle();
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [key, setKey] = useState(0);
  const [imageSize,setImageSize] = useState(0);
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const { getUserDetails } = useAuth();
  const { role } = getUserDetails();

  const VehicleType = {
    PRIVATE: { value: 0, label: "Private" },
    COMMERCIAL: { value: 1, label: "Commercial" },
    TRAILER: { value: 2, label: "Trailer" },
    EQUIPMENT: { value: 3, label: "Equipment" },
    HEAVY_EQUIPMENT: { value: 4, label: "Heavy Equipment" },
  };

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const details = await getVehicleDetails(vehicleId);
        setVehicleDetails(details);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        setIsLoading(false);
      }
    };

    const fetchVehicleImage = async () => {
      try {
        const imageResponse = await viewImage(vehicleId);
        console.log("Vehicle Image:", imageResponse.data.size);
        setImageSize(imageResponse.data.size);
        // const imageUrl = URL.createObjectURL(new Blob([imageResponse.data]));
        // setImageUrl(imageUrl);
        const imageUrl = URL.createObjectURL(imageResponse.data);
        setImageUrl(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.error("Error fetching vehicle image:", error);
      }
    };
    fetchVehicleDetails();
    fetchVehicleImage();
  }, [vehicleId, getVehicleDetails, viewImage,key]);

  const handleAssignVehicle = () => {
    setIsAssignModalOpen(true);
  };

  const handleAssignModalClose = () => {
    setIsAssignModalOpen(false);
    setSelectedUser("");
    reset();
  };

  const handleImageUpload = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
    reset();
  };
  const calculateVehicleAge = (registrationDate) => {
    const now = new Date();
    const registration = new Date(registrationDate);
    const years = differenceInYears(now, registration);
    const months = differenceInMonths(now, registration) % 12;
    return `${years} years ${months} months`;
  };

  const { data: employees } = useQuery({
    queryKey: [
      "employees",
      {
        page: 0,
        size: 10000,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/employees", {
          params: {
            page: 0,
            size: 1000,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch employee data");
      }
    },
  });

  const onSubmit = async (data, e) => {
    try {
      await assignVehicle(vehicleId, data.assignUser);
      toast.success("Vehicle assigned successfully");
      e.target.reset();
      setIsAssignModalOpen(false);
    } catch (error) {
      toast.error("Failed to assign vehicle:", error);
      console.error("Failed to assign vehicle:", error);
    }
  };
  const handleFileChange = (e) => {
    // Handle file input change logic
    setSelectedFile(e.target.files[0]);
    console.log("File selected", e.target.files[0]);
  };

  const onImageUpload = async (data) => {
    console.log("111111");
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      // Implement the image upload logic here
      await uploadImage(vehicleId, selectedFile);
      console.log("Image file:", selectedFile);
      toast.success("Image uploaded successfully");
      setIsImageModalOpen(false);
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to upload image:", error);
      console.error("Failed to upload image:", error);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!vehicleDetails) {
    return <div>No vehicle details found.</div>;
  }

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100 mt-5">
        <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 flex flex-col md:flex-row w-full md:max-w-4/5 lg:max-w-3/4 xl:max-w-2/3">
          <div className="w-full md:w-2/3 md:pr-6">
            <h2 className="text-3xl font-bold mb-4">
              {vehicleDetails.vehicleNumber}{" "}
              <span
                className={`${
                  vehicleDetails.assigned === 0
                    ? "bg-green-500 text-white rounded-md p-1"
                    : "bg-orange-500 text-white rounded-md p-1"
                } font-normal text-sm`}
              >
                {vehicleDetails.assigned === 0 ? "Assigned" : "Idle"}
              </span>
            </h2>
            <p className="text-gray-600 mb-4">
              {vehicleDetails.brand} {vehicleDetails.modal}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">Vehicle Type:</span>
                <span>
                  {
                    Object.values(VehicleType).find(
                      (type) => type.value === vehicleDetails.vehicleType
                    ).label
                  }
                </span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">
                  Insurance Provider:
                </span>
                <span>{vehicleDetails.insuranceProvider}</span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">
                  Insurance Expire:
                </span>
                <span>
                  {new Date(
                    vehicleDetails.insuranceExpire
                  ).toLocaleDateString()}{" "}
                  <span className="font-extrabold text-red-800">
                    {vehicleDetails.noOfDaysInsuranceExpire}
                  </span>{" "}
                  days left
                </span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">Istimara Date:</span>
                <span>
                  {new Date(vehicleDetails.istimaraDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">
                  Total Kilometer:
                </span>
                <span>{vehicleDetails.totalKilometer}</span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">
                  Registration Date:
                </span>
                <span>
                  {new Date(
                    vehicleDetails.registrationDate
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">Assigned User:</span>
                <span>{vehicleDetails.userName || "Not Assigned"}</span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-gray-700 font-bold">
                  Vehicle Age 
                </span>
                <span>
                {calculateVehicleAge(vehicleDetails.registrationDate)}
                </span>
              </div>
              
            </div>
            <div className="flex justify-start space-x-4">
              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  backgroundColor:
                    vehicleDetails.assigned === 0 ? "orange" : "green",
                }}
                onClick={handleAssignVehicle}
              >
                {vehicleDetails.assigned === 0 ? "Reassign" : "Assign"}
              </Button>
              {vehicleDetails.assigned === 0 && (
                <Button
                  variant="contained"
                  style={{ textTransform: "none", backgroundColor: "red" }}
                  onClick={() => removeAssignee(vehicleDetails.id)}
                >
                  Remove Assignee
                </Button>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col justify-between items-center">
            <div className="w-48 h-48">
              {imageSize > 0 ?(
                <img
                  src={imageUrl}
                  alt="Vehicle"
                  className="w-full h-auto rounded-md"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/200"
                  alt="Vehicle"
                  className="w-48 h-48 rounded-md shadow-lg"
                />
              )}
              {role !== 5 && (
                <div className="flex justify-center items-center mt-8">
                  <MyButton type="button" onClick={handleImageUpload}>
                    Upload Image
                  </MyButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal
          open={isAssignModalOpen}
          onClose={handleAssignModalClose}
          aria-labelledby="assign-vehicle-modal-title"
          aria-describedby="assign-vehicle-modal-description"
          className="flex justify-center items-center"
        >
          <div className="bg-white p-8 rounded-lg w-96">
            <h2
              id="assign-vehicle-modal-title"
              className="text-2xl font-bold mb-4"
            >
              Assign Vehicle
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormControl fullWidth error={!!errors.assignUser}>
                <InputLabel id="assign-user-label">Employee</InputLabel>
                <Select
                  native
                  labelId="assign-user-label"
                  id="assign-user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  label="Employee"
                >
                  <option value="" />
                  {employees?.items?.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </Select>
                {errors.assignUser && (
                  <p className="text-red-500">{errors.assignUser.message}</p>
                )}
              </FormControl>
              <div className="flex justify-center space-x-4">
                <MyButton type="submit">Submit</MyButton>
                <MyButton type="reset" onClick={handleAssignModalClose}>
                  Cancel
                </MyButton>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          open={isImageModalOpen}
          onClose={handleImageModalClose}
          aria-labelledby="upload-image-modal-title"
          aria-describedby="upload-image-modal-description"
          className="flex justify-center items-center"
        >
          <div className="bg-white p-8 rounded-lg w-96">
            <h2
              id="upload-image-modal-title"
              className="text-2xl font-bold mb-4"
            >
              Upload Image
            </h2>
            <form className="space-y-4">
              <TextField
                type="file"
                id="file"
                fullWidth
                inputProps={{ accept: "image/*" }}
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                error={!!errors.file}
                helperText={errors.file ? "Please upload a file" : null}
              />
              {/* <Controller
                name="image"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.image}>
                    <TextField
                      type="file"
                      id="image"
                      label="Image"
                      inputProps={{ accept: "image/*" }}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        field.onChange(e.target.files[0]);
                        setSelectedFile(e.target.files[0]);
                      }}
                    />
                    {errors.image && (
                      <p className="text-red-500">{errors.image.message}</p>
                    )}
                  </FormControl>
                )}
              /> */}
              <div className="flex justify-center space-x-4">
                <MyButton type="button" onClick={onImageUpload}>
                  Upload
                </MyButton>
                <MyButton type="reset" onClick={handleImageModalClose}>
                  Cancel
                </MyButton>
              </div>
            </form>
          </div>
        </Modal>
      </div>
      <div>
        <VehicleDocumentView vehicleId={vehicleId} />
      </div>
    </div>
  );
};

export default VehicleDetail;
