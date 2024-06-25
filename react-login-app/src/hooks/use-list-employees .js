import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../services/interceptor';

const useListEmployees = ({ page = 1, size = 10, searchKeyword = '' }) => {
  const { data: employees, isLoading, isError, error } = useQuery({
    queryKey: ['employees', { page, size, searchKeyword }], // Include page, size, and searchKeyword in the query key
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/user/employees', {
          params: { page, size, searchKeyword }, // Set page, size, and searchKeyword as query parameters
        });
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch employee data');
      }
    },
  });
  


  return { employees, isLoading, isError, error };
};

export default useListEmployees;
