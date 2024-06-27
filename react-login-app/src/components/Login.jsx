import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useLogin from '../hooks/use-login';
import errorMessages from '../services/errorMessages';

const schema = z.object({
  employeeId: z.string()
    .min(1, { message: 'Employee ID is required' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Employee ID must contain only alphanumeric characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const { getLogin } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await getLogin.mutateAsync(data);
      toast.success('Login successful');
      if(localStorage.getItem('role') === '2') {
      navigate('/dashboard');
      }
      else if(localStorage.getItem('role') === '3') {
        navigate('/employeeDashboard');
      }
      else if(localStorage.getItem('role') === '1') {
        navigate('/dashboardAdmin');
      }else if(localStorage.getItem('role') === '4') {
        navigate('/hodDashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errorCode) {
        const errorMessage = errorMessages[error.response.data.errorCode] || errorMessages['UNKNOWN_ERROR'];
        toast.error(errorMessage);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="relative h-screen">
      <ToastContainer theme='colored' autoClose={2000} stacked closeOnClick />
      {/* , opacity: 0.6 */}
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('assets/WEP.png')", opacity: 0.4  }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded p-5 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <h1 className='text-center text-red-900 font-bold text-4xl'>Login</h1>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeId">Username</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="employeeId" type="text" placeholder="Enter your username" {...register('employeeId')} />
            {errors.employeeId && <p className="text-red-500">{errors.employeeId.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                   id="password" type="password" placeholder="Enter your password" {...register('password')} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
