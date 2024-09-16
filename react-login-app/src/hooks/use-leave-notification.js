
import { axiosInstance } from "../services/interceptor";

const useLeaveNotification=()=>{
    const getLeaveNotification = async () => {
        try {
            const response = await axiosInstance.get(`/leave/notification`);
            console.log(response.data);
            return response.data; // Return the response data
        } catch (error) {
            console.error('Error Accepting leave:', error.response ? error.response.data : error.message);
            throw error; // Optionally, throw the error if you want to handle it in the component
        }
    };

    return {getLeaveNotification};
}
export default useLeaveNotification;