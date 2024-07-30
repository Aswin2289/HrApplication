import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RouterComponent from './routes/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="colored" autoClose={2000} stacked closeOnClick />
      <Router>
        <RouterComponent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
