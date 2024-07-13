// src/components/Layout/Layout.jsx

import React from 'react';
import Header from './Header/header';
import Sidebar from './Sidebar/sidebar';
import Footer from './Footer/footer';

function Layout({ children }) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Header />
      <div className="flex flex-grow mt-24">
        <Sidebar />
        <div className="flex-1  p-8"> {/* Adjust ml-64 to match the sidebar width */}
          {children}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
