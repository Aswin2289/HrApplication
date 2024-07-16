import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../services/interceptor';
import { useNavigate } from 'react-router-dom';

const useAddEmployee = () => {
  const navigate = useNavigate();

  const addEmployeeMutation = useMutation({
    mutationFn: (data) => {
      return axiosInstance.post('/user/add', data).then((res) => res.data);
    },
    onSuccess: () => {
      navigate('/'); // Example: Navigate to dashboard after adding employee
    },
    onError: () => {
    },
  });

  const addEmployee = async (employeeData) => {
    try {
      // Call mutateAsync to execute the mutation
      await addEmployeeMutation.mutateAsync(employeeData);
      // Optionally handle success here if not handled in onSuccess
    } catch (error) {
      // Optionally handle error here if not handled in onError
    }
  };

  const changePassword =async (id,data) => {
    try {
      const response = await axiosInstance.put(`/user/changePassword/${id}`, data);
      console.log(response.data);
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error changing password:', error.response? error.response.data : error.message);
      throw error; // Optionally, throw the error if you want to handle it in the component
    }
  };

  return { addEmployee,changePassword };
};

export default useAddEmployee;
