import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import addCarAnimation from "../profile/car_parkinng.json";
import useAddVehicle from "../hooks/use-add-vehicle";

// Define the VehicleType enum as constants
const VehicleType = {
  PRIVATE: { value: 0, label: "Private" },
  COMMERCIAL: { value: 1, label: "Commercial" },
  TRAILER: { value: 2, label: "Trailer" },
  EQUIPMENT: { value: 3, label: "Equipment" },
  HEAVY_EQUIPMENT: { value: 4, label: "Heavy Equipment" },
};

const schema = z.object({
  vehicleNumber: z.string().min(1, { message: "Vehicle number is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  modal: z.string().min(1, { message: "Modal is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  insuranceProvider: z
    .string()
    .min(1, { message: "Insurance provider is required" }),
  totalKilometer: z.string().min(1, { message: "Total kilometer is required" }),
  remarks: z.string().optional(),
  istimaraNumber: z.string().min(1, { message: "Istimara number is required" }),
});

function AddVehicle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { addVehicle } = useAddVehicle(); // Initialize your custom hook

  const [vehicleData, setVehicleData] = useState({
    manufactureDate: new Date(),
    insuranceExpire: new Date(),
    istimaraDate: new Date(),
    registrationDate: new Date(),
  });

  const onSubmit = async (data) => {
    data.manufactureDate = vehicleData.manufactureDate;
    data.insuranceExpire = vehicleData.insuranceExpire;
    data.istimaraDate = vehicleData.istimaraDate;
    data.registrationDate = vehicleData.registrationDate;

    try {
      await addVehicle(data);
      toast.success("Vehicle added successfully");
      // Reset form after successful submission
      setValue("vehicleNumber", "");
      setValue("vehicleType", "");
      setValue("modal", "");
      setValue("brand", "");
      setValue("insuranceProvider", "");
      setValue("totalKilometer", "");
      setValue("remarks", "");
      setValue("istimaraNumber", "");
      setVehicleData({
        manufactureDate: new Date(),
        insuranceExpire: new Date(),
        istimaraDate: new Date(),
        registrationDate: new Date(),
      });
    } catch (error) {
      toast.error(
        "Error adding vehicle: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-10">Add Vehicle &nbsp; 🚗</h2>
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex-1">
                <label className="block mb-1 label">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  {...register("vehicleNumber")}
                  placeholder="Vehicle Number"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.vehicleNumber && (
                  <p className="text-red-500">{errors.vehicleNumber.message}</p>
                )}
              </div>
              <div className="md:row-span-4 md:ml-4">
                <Lottie animationData={addCarAnimation} loop={true} />
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Modal</label>
                <input
                  type="text"
                  name="modal"
                  {...register("modal")}
                  placeholder="Modal"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.modal && (
                  <p className="text-red-500">{errors.modal.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Vehicle Type</label>
                <select
                  {...register("vehicleType")}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select Vehicle Type</option>
                  {Object.values(VehicleType).map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p className="text-red-500">{errors.vehicleType.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  {...register("brand")}
                  placeholder="Brand"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.brand && (
                  <p className="text-red-500">{errors.brand.message}</p>
                )}
              </div>
              <div className="flex-1">
                <div className="flex">
                  <div className="flex-1 mr-2">
                    {" "}
                    {/* Added flex-1 and margin-right */}
                    <label className="block mb-1 label">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="insuranceProvider"
                      {...register("insuranceProvider")}
                      placeholder="Insurance Provider"
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                    {errors.insuranceProvider && (
                      <p className="text-red-500">
                        {errors.insuranceProvider.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 ml-2">
                    {" "}
                    {/* Added flex-1 and margin-left */}
                    <label className="block mb-1 label">Insurance Expire</label>
                    <DatePicker
                      selected={vehicleData.insuranceExpire}
                      onChange={(date) =>
                        setVehicleData({
                          ...vehicleData,
                          insuranceExpire: date,
                        })
                      }
                      minDate={new Date()} // Disable past dates
                      showYearDropdown
                      showMonthDropdown
                      dateFormat="dd/MM/yyyy"
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                    {errors.insuranceExpire && (
                      <p className="text-red-500">
                        {errors.insuranceExpire.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label className="block mb-1 label">Registration Date</label>
                <DatePicker
                  selected={vehicleData.registrationDate}
                  onChange={(date) =>
                    setVehicleData({ ...vehicleData, registrationDate: date })
                  }
                  maxDate={new Date()} // Disable past dates
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.registrationDate && (
                  <p className="text-red-500">
                    {errors.registrationDate.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Total Kilometer</label>
                <input
                  type="text"
                  name="totalKilometer"
                  {...register("totalKilometer")}
                  placeholder="Total Kilometer"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.totalKilometer && (
                  <p className="text-red-500">
                    {errors.totalKilometer.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Manufacture Date</label>
                <DatePicker
                  selected={vehicleData.manufactureDate}
                  onChange={(date) =>
                    setVehicleData({ ...vehicleData, manufactureDate: date })
                  }
                  maxDate={new Date()} // Disable future dates
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.manufactureDate && (
                  <p className="text-red-500">
                    {errors.manufactureDate.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <div className="flex gap-6">
                  <div>
                    <label className="block mb-1 label">Istimara Date</label>
                    <DatePicker
                      selected={vehicleData.istimaraDate}
                      onChange={(date) =>
                        setVehicleData({ ...vehicleData, istimaraDate: date })
                      }
                      minDate={new Date()} // Disable past dates
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                    {errors.istimaraDate && (
                      <p className="text-red-500">
                        {errors.istimaraDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 label">Istimara Number</label>
                    <input
                      type="text"
                      name="istimaraNumber"
                      {...register("istimaraNumber")}
                      placeholder="Istimara Number"
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                    {errors.istimaraNumber && (
                      <p className="text-red-500">
                        {errors.istimaraNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 label">Remarks</label>
                <textarea
                  name="remarks"
                  {...register("remarks")}
                  placeholder="Remarks"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.remarks && (
                  <p className="text-red-500">{errors.remarks.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              >
                Submit
              </button>
              <button
                type="reset"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full ml-4"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddVehicle;
