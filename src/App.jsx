import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import { isLoggedIn } from "./auth";
import { useEffect, useState } from "react";
import Login from "./pages/common/Login";
import Dashboard from "./pages/common/Dashboard";
import Attendance from "./pages/common/Attendance";
import MyAttendance from "./pages/common/MyAttendance";
import MyTasks from "./pages/common/MyTasks";
import PasswordUpdate from "./pages/common/PasswordUpdate";
import Customers from "./pages/crm/Customers";
import Agents from "./pages/crm/Agents";
import Inventory from "./pages/crm/Inventory";
import Enquiries from "./pages/crm/Enquiries";
import SiteVisits from "./pages/bdm/SiteVisits";

import UserRegistration from "./pages/admin/UserRegistration";
import AttendanceSearch from "./pages/admin/AttendanceSearch";
import TaskSearch from "./pages/admin/TaskSearch";
import SiteVisitManagement from "./pages/admin/SiteVisitManagement";
import Loader from "./components/common/Loader";
import Projects from "./pages/crm/Projects";
import ProjectInventory from "./pages/crm/ProjectInventory";
import ProjectMedia from "./pages/crm/ProjectMedia";

function Protected() {
  return isLoggedIn() ? <Layout /> : <Navigate to="/login" replace />;
}

export default function App() {
const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (event) => {
      setLoading(event.detail);
    };

    window.addEventListener("api-loading", handleLoading);

    return () => {
      window.removeEventListener("api-loading", handleLoading);
    };
  }, []);


  return (
     <>
      {loading && <Loader />}
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/my" element={<MyAttendance />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/password" element={<PasswordUpdate />} />

        <Route path="/customers" element={<Customers />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/enquiries" element={<Enquiries />} />

        <Route path="/site-visits" element={<SiteVisits />} />

        <Route path="/admin/users" element={<UserRegistration />} />
        <Route path="/admin/attendance" element={<AttendanceSearch />} />
        <Route path="/admin/tasks" element={<TaskSearch />} />
        <Route path="/admin/site-visits" element={<SiteVisitManagement />} />
        <Route path="/projects" element={<Projects />}/>
        <Route path="/projects/:projectId/inventory" element={<ProjectInventory />}/>
        <Route path="/projects/:projectId/media" element={<ProjectMedia />}/>
      </Route>
      <Route
        path="*"
        element={<Navigate to={isLoggedIn() ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
     </>
  );
}