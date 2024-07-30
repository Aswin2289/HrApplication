

import { axiosInstance } from "../services/interceptor";
import { useMemo } from "react";

const useUpdateEmployee = () => {
    const updateEmployee = async (employeeId, employeeData) => {
        try {
            const response = await axiosInstance.put(`/user/update/${employeeId}`, employeeData);
            console.log("Employee updated:", response.data);
            return response.data;
        } catch (error) {
            console.error(
                "Error updating employee:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
    };

    return useMemo(() => ({ updateEmployee }), []);
};
export default useUpdateEmployee;