// src/pages/EmployeeDetailPage.jsx

import React from "react";
import Layout from "../components/Layout"; // Import the Layout component
import EmployeeDetails from "../components/employee-details";

function EmployeeDetailPage() {
  return (
    <Layout> {/* Render the Layout component to include the Header */}
      <EmployeeDetails /> {/* Render the EmployeeDetails component under the Header */}
    </Layout>
  );
}

export default EmployeeDetailPage;
