import React, { useEffect, useState } from "react";
import {
  searchAttendance,
  getUsers,
} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

function getDefaultDates() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return {
    fromDate: `${year}-${month}-01`,
    toDate: `${year}-${month}-${day}`,
  };
}

export default function AttendanceSearch() {
  const defaultDates = getDefaultDates();

  const [f, setF] = useState({
    employeeId: "",
    fromDate: defaultDates.fromDate,
    toDate: defaultDates.toDate,
  });

  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /*
   * ============================
   * LOAD EMPLOYEES
   * ============================
   */
  async function loadEmployees() {
    setLoadingEmployees(true);

    try {
      const { data } = await getUsers();

      const users = Array.isArray(data)
        ? data
        : data?.content || [];

      setEmployees(users);
    } catch (error) {
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  /*
   * ============================
   * SEARCH
   * ============================
   */
  async function search() {
    setLoading(true);

    try {
      const { data } = await searchAttendance(f);

      setRows(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (error) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * ============================
   * HANDLE CHANGE
   * ============================
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setF((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /*
   * ============================
   * RENDER
   * ============================
   */
  return (
    <>
      <PageHeader
        title="Attendance Search"
        subtitle="Search an employee between dates."
      />

      {/* ============================
          FILTER
      ============================ */}
      <div className="panel filter-bar">

        {/* EMPLOYEE */}
        <label>
          Employee

          <select
            name="employeeId"
            value={f.employeeId}
            onChange={handleChange}
          >
            <option value="">
              All Employees
            </option>

            {loadingEmployees ? (
              <option disabled>
                Loading employees...
              </option>
            ) : (
              employees.map((user) => {
                const employee =
                  user.employee || {};

                const employeeId =
                  user.employeeId ||
                  employee.id;

                return (
                  <option
                    key={employeeId}
                    value={employeeId}
                  >
                    {employee.name || "-"}
                    {" - "}
                    {employeeId}
                  </option>
                );
              })
            )}
          </select>
        </label>

        {/* FROM */}
        <label>
          From

          <input
            type="date"
            name="fromDate"
            value={f.fromDate}
            onChange={handleChange}
          />
        </label>

        {/* TO */}
        <label>
          To

          <input
            type="date"
            name="toDate"
            value={f.toDate}
            onChange={handleChange}
          />
        </label>

        {/* SEARCH */}
        <button
          className="btn primary"
          type="button"
          onClick={search}
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </div>

      {/* ============================
          RESULTS
      ============================ */}
      <div className="panel">
        <DataTable
          columns={[
            "Employee",
            "Date",
            "Login",
            "Logout",
            "Login Location",
            "Logout Location"
          ]}
          rows={rows.map((r) => [
            r.employeeName ||
              "-",

            r.attendanceDate || "-",

            r.loginTime || "-",

            r.logoutTime || "-",

           <a
            href={`https://www.google.com/maps?q=${r.loginLatitude},${r.loginLongitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
           View Location
          </a>,

           <a
            href={`https://www.google.com/maps?q=${r.logoutLatitude},${r.logoutLongitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
           View Location
          </a>
          ])}
        />
      </div>
    </>
  );
}