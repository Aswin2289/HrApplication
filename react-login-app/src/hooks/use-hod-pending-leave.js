import { axiosInstance } from "../services/interceptor";

const useHodPendingLeave=()=>{
    const rejectPendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hod/rejectLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error rejecting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const acceptPendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hod/acceptLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const deletePendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hod/deleteLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };

    return { rejectPendingLeave,acceptPendingLeave ,deletePendingLeave};
}
export default useHodPendingLeave;