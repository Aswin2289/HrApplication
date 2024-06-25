// src/components/Layout/Layout.jsx

import React from 'react';
import Header from './Header/header';
import Sidebar from './Sidebar/sidebar';

function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="ml-25 p-8 w-full"> {/* Adjust ml-64 to match the sidebar width */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
