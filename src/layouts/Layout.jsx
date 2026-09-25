import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Activity, Building2, CalendarDays, ClipboardList, Contact,
  FileText, KeyRound, LayoutDashboard, LogOut, MapPin, Menu,
  Users, X
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
  ["Site Visits", "/site-visits", MapPin]
];

const admin = [
  ["User Registration", "/admin/users", Users],
  ["Attendance Search", "/admin/attendance", Activity],
  ["Task Search", "/admin/tasks", ClipboardList],
  ["Site Visit Management", "/admin/site-visits", MapPin]
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = getUser();
  const role = getRole();

  const item = ([label, to, Icon]) => (
    <Link
      key={to}
      to={to}
      className={`nav-item ${location.pathname === to ? "active" : ""}`}
      onClick={() => setOpen(false)}
    >
      <Icon size={17} /> {label}
    </Link>
  );

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"> <img src="/bsa-logo.png" alt="BSA Logo" /></div>
          <div><b>BSA Connect</b><small>Business Management</small></div>
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)}><X /></button>
        </div>

        <div className="nav-title">WORKSPACE</div>
        {common.map(item)}

        {role === "ADMIN" && (
          <>
            <div className="nav-title admin-title">ADMINISTRATION</div>
            {admin.map(item)}
          </>
        )}

        <div className="sidebar-bottom">
          {item(["Change Password", "/password", KeyRound])}
          <button className="nav-item logout" onClick={() => { logout(); window.location.href = "/login"; }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu /></button>
          <div></div>
          <div className="profile">
            <div className="avatar">{(user?.loginName || "U")[0].toUpperCase()}</div>
            <div><b>{user?.loginName || "User"}</b><small>{role}</small></div>
          </div>
        </header>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  );
}