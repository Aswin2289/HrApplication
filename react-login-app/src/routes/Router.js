import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import Dashboard from "../pages/Dashboard";
import ListEmployeePage from "../pages/List-employee-page";
import AddEmployeePage from "../pages/add-employee-page";
import NotFound from "../pages/not-found-page";
import EmployeeDetailPage from "../pages/employe-detail-page";
import AuthGuard from "./auth-guard"; // Import the AuthGuard component
import useAuth from "../hooks/use-auth";
import EmployeeDashboardPage from "../pages/Employee/employee-dashboard-page";
import AddLeavePage from "../pages/Employee/add-leave-page";
import PendingLeavePage from "../pages/Employee/pending-leave-page";
import ApprovedLeavePage from "../pages/Employee/approved-leave-page";
import RejectedLeavePage from "../pages/Employee/rejected-leave-page";
import PendingAllEmployeeLeavePage from "../pages/pending-all-employee-leave-page";
import EmployeeLeaveListPage from "../pages/employee-leave-list-page";
import DashboardAdmin from "../components/Admin/Dashboard-admin";
import AllPendingLeaveRequestPage from "../pages/Admin/all-pending-leave-request-page";
import AllAcceptedLeaveRequestPage from "../pages/Admin/all-accepted-leave-request-page";
import PendingApplicationPage from "../pages/Employee/pending-application-page";
import PDFViewPage from "../pages/pdf-view-page";
import HodDashboardPage from "../pages/hod/hod-dashboard-page";
import AllPendingHodLeaveRequestPage from "../pages/hod/all-pending-hod-leave-request-page";
import AddVehiclePage from "../pages/add-vehicle-page";
import VehicleListPage from "../pages/vehicle-list-page";
import VehicleDetailPage from "../pages/vehicle-detail-page";
import ProfileViewPage from "../pages/Employee/profile-view-page";
import ChangePasswordPage from "../pages/Employee/change-password-page";

function RouterComponent() {
  const { isAuthenticated, getUserDetails } = useAuth();
  const authenticated = isAuthenticated();
  const { role } = getUserDetails();

  const handleNavigateToDashboard = () => {
    if (authenticated) {
      if (role === 2) {
        return <Navigate to="/dashboard" />;
      } else if (role === 3) {
        return <Navigate to="/employeeDashboard" />;
      } else if (role === 1) {
        return <Navigate to="/dashboardAdmin" />;
      } else if (role === 4) {
        return <Navigate to="/hodDashboard" />;
      } else {
        return <Navigate to="/login" />;
      }
    }
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={handleNavigateToDashboard()} />
      <Route
        path="/dashboard"
        element={<AuthGuard element={<Dashboard />} allowedRoles={[2]} />}
      />
      <Route
        path="/addEmployee"
        element={
          <AuthGuard element={<AddEmployeePage />} allowedRoles={[1, 2]} />
        }
      />
      <Route
        path="/listEmployee"
        element={
          <AuthGuard element={<ListEmployeePage />} allowedRoles={[1, 2, 4]} />
        }
      />
      <Route
        path="/employeeDetail"
        element={
          <AuthGuard
            element={<EmployeeDetailPage />}
            allowedRoles={[1, 2, 4]}
          />
        }
      />
      <Route
        path="/pendingAllEmployeeLeave"
        element={
          <AuthGuard
            element={<PendingAllEmployeeLeavePage />}
            allowedRoles={[2]}
          />
        }
      />
      <Route
        path="/employeeLeaveList"
        element={
          <AuthGuard
            element={<EmployeeLeaveListPage />}
            allowedRoles={[1, 2]}
          />
        }
      />
      <Route
        path="/pdfview"
        element={<AuthGuard element={<PDFViewPage />} allowedRoles={[1, 2]} />}
      />
      {/* Employee routers added below */}
      <Route
        path="/employeeDashboard"
        element={
          <AuthGuard element={<EmployeeDashboardPage />} allowedRoles={[3]} />
        }
      />
      <Route
        path="/profileview"
        element={
          <AuthGuard element={<ProfileViewPage />} allowedRoles={[1, 2, 3, 4]} />
        }
      />
      <Route
        path="/changePassword"
        element={
          <AuthGuard element={<ChangePasswordPage />} allowedRoles={[1, 2, 3, 4]} />
        }
      />
      <Route
        path="/addLeave"
        element={
          <AuthGuard element={<AddLeavePage />} allowedRoles={[1, 2, 3, 4]} />
        }
      />
      <Route
        path="/pendingLeaves"
        element={
          <AuthGuard
            element={<PendingLeavePage />}
            allowedRoles={[1, 2, 3, 4]}
          />
        }
      />
      <Route
        path="/approvedLeaves"
        element={
          <AuthGuard
            element={<ApprovedLeavePage />}
            allowedRoles={[1, 2, 3, 4]}
          />
        }
      />
      <Route
        path="/rejectedLeaves"
        element={
          <AuthGuard
            element={<RejectedLeavePage />}
            allowedRoles={[1, 2, 3, 4]}
          />
        }
      />
      <Route
        path="/pendingApplication"
        element={
          <AuthGuard
            element={<PendingApplicationPage />}
            allowedRoles={[1, 2, 3, 4]}
          />
        }
      />
      <Route
        path="/addVehicle"
        element={
          <AuthGuard
            element={<AddVehiclePage />}
            allowedRoles={[1, 2]}
          />
        }
      />
      <Route
        path="/addVehicle/:id"
        element={
          <AuthGuard
            element={<AddVehiclePage />}
            allowedRoles={[1, 2,4]}
          />
        }
      />
      <Route
        path="/listVehicle"
        element={
          <AuthGuard
            element={<VehicleListPage />}
            allowedRoles={[1, 2,4]}
          />
        }
      />
      <Route
        path="/detailVehicle"
        element={
          <AuthGuard
            element={<VehicleDetailPage />}
            allowedRoles={[1, 2,4]}
          />
        }
      />
      {/* Super ADmin routers added below */}
      <Route
        path="/dashboardAdmin"
        element={<AuthGuard element={<DashboardAdmin />} allowedRoles={[1]} />}
      />
      <Route
        path="/allPendingLeaveRequest"
        element={
          <AuthGuard
            element={<AllPendingLeaveRequestPage />}
            allowedRoles={[1]}
          />
        }
      />
      <Route
        path="/allAcceptedLeaveRequest"
        element={
          <AuthGuard
            element={<AllAcceptedLeaveRequestPage />}
            allowedRoles={[1]}
          />
        }
      />
      {/* HOD routers added below */}
      <Route
        path="/hodDashboard"
        element={
          <AuthGuard element={<HodDashboardPage />} allowedRoles={[4]} />
        }
      />
      <Route
        path="/allpendingrequesthod"
        element={
          <AuthGuard
            element={<AllPendingHodLeaveRequestPage />}
            allowedRoles={[4]}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RouterComponent;
