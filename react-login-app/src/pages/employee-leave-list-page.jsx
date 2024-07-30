// employee-leave-list-page.js

import React from 'react';
import EmployeeLeaveList from '../components/employee-leave-list'; // Import your component
import Layout from '../components/Layout'; // Assuming you have a Layout component

const EmployeeLeaveListPage = () => {
  return (
    <Layout> {/* Assuming Layout is your layout wrapper */}
      <EmployeeLeaveList /> {/* Render your component */}
    </Layout>
  );
};

export default EmployeeLeaveListPage;
