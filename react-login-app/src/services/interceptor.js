import axios from 'axios';

// Create an instance of Axios with default configurations
// const baseURLData = import.meta.env.VITE_API_BASE_URL;
// console.log("========================",baseURLData);

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

// Add access token to request headers
axiosInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request; 
});

// Handle errors in responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401) or forbidden (403) errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle unauthorized access here
      // For example, you can logout the user or redirect them to login page
      // logout();
    }
    return Promise.reject(error);
  }
);
export const axiosInstance1 = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
axiosInstance1.interceptors.request.use((request) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request; 
});
axiosInstance1.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401) or forbidden (403) errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle unauthorized access here
      // For example, you can logout the user or redirect them to login page
      // logout();
    }
    return Promise.reject(error);
  }
);
