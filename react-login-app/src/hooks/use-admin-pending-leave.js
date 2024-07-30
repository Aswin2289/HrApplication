
import { axiosInstance } from "../services/interceptor";

const useAdminPendingLeave = () => {
    const rejectPendingLeaveAdmin = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/admin/rejectLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error rejecting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const acceptPendingLeaveAdmin = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/admin/acceptLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const deletePendingLeaveAdmin = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/admin/deleteLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const rejectAcceptedPendingLeaveAdmin = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/admin/rejectAcceptedLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error rejecting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    
    return { rejectPendingLeaveAdmin,acceptPendingLeaveAdmin ,deletePendingLeaveAdmin,rejectAcceptedPendingLeaveAdmin};
    }

export default useAdminPendingLeave;
