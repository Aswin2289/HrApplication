import { axiosInstance } from "../services/interceptor";

const useHrPendingLeave = () => {

    const rejectPendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hr/rejectLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error rejecting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const acceptPendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hr/acceptLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };
    const deletePendingLeave = async (id) => {
        try {
            const response = await axiosInstance.put(`/leave/hr/deleteLeave/${id}`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };

    return { rejectPendingLeave,acceptPendingLeave ,deletePendingLeave};

};

export default useHrPendingLeave;
