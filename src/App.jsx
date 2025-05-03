import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Components
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";

// Admin Components
import SidebarLayout from "./components/SidebarLayout";
import Issues from "./components/Issues";
import Settings from "./components/Settings";
import History from "./components/History";

// Student Components
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./components/StudentDashboard";
import Explore from "./components/Explore";
import Help from "./components/Help";
import ReportIssue from "./components/ReportIssue";
import IssueDetail from "./components/IssueDetail";
import ProfileUpdateForm from "./components/ProfileUpdateForm";

// Context & Route Protection
import { AdminProvider } from "./context/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AdminProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute userType="admin">
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Issues />} />
          <Route path="issues" element={<Issues />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Student Protected Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute userType="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="help" element={<Help />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="issue/:id" element={<IssueDetail />} />
          <Route path="profile" element={<ProfileUpdateForm />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}

export default App;
