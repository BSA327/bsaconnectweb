import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  Building2,
  CalendarDays,
  ClipboardList,
  Contact,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Users,
  X,
} from "lucide-react";

import { getRole, getUser, logout } from "../auth";

const common = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Mark Attendance", "/attendance", MapPin],
  ["My Attendance", "/attendance/my", CalendarDays],
  ["My Tasks", "/tasks", ClipboardList],
  ["Customers", "/customers", Contact],
  ["Agents / CP", "/agents", Users],
  ["Inventory", "/inventory", Building2],
  ["Enquiries", "/enquiries", FileText],
  ["Site Visits", "/site-visits", MapPin],
];

const admin = [
  ["User Registration", "/admin/users", Users],
  ["Attendance Search", "/admin/attendance", Activity],
  ["Task Search", "/admin/tasks", ClipboardList],
  ["Site Visit Management", "/admin/site-visits", MapPin],
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  const [currentDateTime, setCurrentDateTime] =
    useState(new Date());

  const location = useLocation();

  const user = getUser();
  const role = getRole();

  // -----------------------------------------
  // Live date & time
  // -----------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDateTime =
    currentDateTime.toLocaleString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  // -----------------------------------------
  // Navigation item
  // -----------------------------------------

  const item = ([label, to, Icon]) => (
    <Link
      key={to}
      to={to}
      className={`nav-item ${
        location.pathname === to ? "active" : ""
      }`}
      onClick={() => setOpen(false)}
    >
      <Icon size={17} />
      {label}
    </Link>
  );

  // -----------------------------------------
  // Logout
  // -----------------------------------------

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <div className="app">

      {/* Sidebar */}

      <aside
        className={`sidebar ${
          open ? "open" : ""
        }`}
      >

        {/* Brand */}

        <div className="brand">

          <div className="brand-icon">
            <img
              src="/bsa-logo.png"
              alt="BSA Logo"
            />
          </div>

          <div>
            <b>BSA Connect</b>
            <small>Business Management</small>
          </div>

          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>

        </div>

        {/* Workspace */}

        <div className="nav-title">
          WORKSPACE
        </div>

        {common.map(item)}

        {/* Administration */}

        {role === "ADMIN" && (
          <>
            <div className="nav-title admin-title">
              ADMINISTRATION
            </div>

            {admin.map(item)}
          </>
        )}

        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          {item([
            "Change Password",
            "/password",
            KeyRound,
          ])}

          <button
            className="nav-item logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* Mobile overlay */}

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}

      <main className="main">

        {/* Topbar */}

        <header className="topbar">

  <button
    className="icon-btn mobile-only"
    onClick={() => setOpen(true)}
  >
    <Menu />
  </button>

  <div className="topbar-left">
    <div className="datetime-card">
      <div className="datetime-icon">
        <CalendarDays size={18} />
      </div>

      <div className="datetime-info">
        <span className="datetime-day">
          {currentDateTime.toLocaleDateString("en-IN", {
            weekday: "long",
          })}
        </span>

        <span className="datetime-date">
          {currentDateTime.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="datetime-time">
          {currentDateTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  </div>

  <div className="profile">

    <div className="profile-avatar">
      {(user?.loginName || "U")[0].toUpperCase()}
    </div>

    <div className="profile-info">
      <b>{user?.loginName || "User"}</b>

      <div className="profile-role">
        <span className="status-dot"></span>
        {role}
      </div>
    </div>

  </div>

</header>

        {/* Page Content */}

        <div className="content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}