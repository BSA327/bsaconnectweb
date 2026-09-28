import React, { useEffect, useRef, useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import { getRole, getUser, logout } from "../auth";


// ======================================================
// SIDEBAR MENU
// ======================================================

const common = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Projects", "/projects", Building2],

  // Attendance / Tasks removed from sidebar

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


// ======================================================
// PROFILE MENU
// ======================================================

const profileMenu = [
  ["Mark Attendance", "/attendance", MapPin],
  ["My Attendance", "/attendance/my", CalendarDays],
  ["My Tasks", "/tasks", ClipboardList],
  ["Change Password", "/password", KeyRound],
];


// ======================================================
// LAYOUT
// ======================================================

export default function Layout() {

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [currentDateTime, setCurrentDateTime] =
    useState(new Date());

  const location = useLocation();

  const profileRef = useRef(null);

  const user = getUser();
  const role = getRole();


  // ======================================================
  // LIVE DATE & TIME
  // ======================================================

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);


  // ======================================================
  // CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ======================================================
  // CLOSE PROFILE MENU WHEN ROUTE CHANGES
  // ======================================================

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);


  // ======================================================
  // NAVIGATION ITEM
  // ======================================================

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

      <span>{label}</span>

    </Link>

  );


  // ======================================================
  // PROFILE MENU ITEM
  // ======================================================

  const profileItem = ([label, to, Icon]) => (

    <Link
      key={to}
      to={to}
      className={`profile-menu-item ${
        location.pathname === to
          ? "profile-menu-active"
          : ""
      }`}
      onClick={() => {
        setProfileOpen(false);
        setOpen(false);
      }}
    >

      <div className="profile-menu-icon">
        <Icon size={17} />
      </div>

      <span>{label}</span>

    </Link>

  );


  // ======================================================
  // LOGOUT
  // ======================================================

  function handleLogout() {

    logout();

    window.location.href = "/login";

  }


  // ======================================================
  // RETURN
  // ======================================================

  return (

    <div className="app">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`sidebar ${
          open ? "open" : ""
        }`}
      >


        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">

            <img
              src="/bsa-logo.png"
              alt="BSA Logo"
            />

          </div>


          <div>

            <b>BSA Connect</b>

            <small>
              Business Management
            </small>

          </div>


          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(false)}
          >

            <X />

          </button>

        </div>


        {/* WORKSPACE */}

        <div className="nav-title">
          WORKSPACE
        </div>


        {common.map(item)}


        {/* ADMINISTRATION */}

        {role === "ADMIN" && (

          <>

            <div className="nav-title admin-title">
              ADMINISTRATION
            </div>

            {admin.map(item)}

          </>

        )}


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="nav-item logout"
            onClick={handleLogout}
          >

            <LogOut size={17} />

            <span>Logout</span>

          </button>

        </div>

      </aside>


      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {open && (

        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />

      )}


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="main">


        {/* ==================================================
            TOPBAR
        ================================================== */}

        <header className="topbar">


          {/* MOBILE MENU */}

          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(true)}
          >

            <Menu />

          </button>


          {/* DATE / TIME */}

          <div className="topbar-left">

            <div className="datetime-card">

              <div className="datetime-icon">

                <CalendarDays size={18} />

              </div>


              <div className="datetime-info">

                <span className="datetime-day">

                  {currentDateTime.toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                    }
                  )}

                </span>


                <span className="datetime-date">

                  {currentDateTime.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}

                </span>


                <span className="datetime-time">

                  {currentDateTime.toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    }
                  )}

                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              PROFILE
          ================================================== */}

          <div
            className={`profile-wrapper ${
              profileOpen
                ? "profile-open"
                : ""
            }`}
            ref={profileRef}
          >


            {/* PROFILE BUTTON */}

            <button
              className="profile"
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
            >

              <div className="profile-avatar">

                {(user?.loginName || "U")[0]
                  .toUpperCase()}

              </div>


              <div className="profile-info">

                <b>
                  {user?.loginName || "User"}
                </b>

                <div className="profile-role">

                  <span className="status-dot"></span>

                  {role}

                </div>

              </div>


              <ChevronDown
                size={17}
                className="profile-chevron"
              />

            </button>


            {/* ==================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (

              <div className="profile-dropdown">


                {/* PROFILE HEADER */}

                <div className="profile-dropdown-header">

                  <div className="profile-dropdown-avatar">

                    {(user?.loginName || "U")[0]
                      .toUpperCase()}

                  </div>


                  <div>

                    <strong>
                      {user?.loginName || "User"}
                    </strong>

                    <span>
                      <span className="status-dot"></span>
                      {role}
                    </span>

                  </div>

                </div>


                {/* SEPARATOR */}

                <div className="profile-divider" />


                {/* MENU */}

                <div className="profile-menu">

                  {profileMenu.map(
                    profileItem
                  )}

                </div>


                {/* SEPARATOR */}

                <div className="profile-divider" />


                {/* LOGOUT */}

                <button
                  className="profile-menu-item profile-logout"
                  onClick={handleLogout}
                >

                  <div className="profile-menu-icon">
                    <LogOut size={17} />
                  </div>

                  <span>Logout</span>

                </button>

              </div>

            )}

          </div>

        </header>


        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <div className="content">

          <Outlet />

        </div>

      </main>

    </div>

  );

}