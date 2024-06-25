// import { useMutation } from '@tanstack/react-query';
// import { axiosInstance } from '../services/interceptor';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();


  const logout = () => {
    localStorage.clear();
    navigate('/')
    window.location.reload();
  };

  const getUserDetails = () => {
    return {
      username: localStorage.getItem('username'),
      role: parseInt(localStorage.getItem('role')),
      id: localStorage.getItem('employeeId'),
      userId: localStorage.getItem('userId'),
    };
  };

  const isAuthenticated = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  return {  logout, getUserDetails, isAuthenticated };
};


export default useAuth;
