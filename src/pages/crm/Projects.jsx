import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";


// ==========================================================
// DATE HELPERS
// ==========================================================

// API -> HTML date input
// 28/09/2026 -> 2026-09-28
function formatDateForInput(date) {

  if (!date) return "";

  // Already ISO format
  if (date.includes("-")) {
    return date;
  }

  const parts = date.split("/");

  if (parts.length !== 3) {
    return "";
  }

  const [day, month, year] = parts;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}


// HTML date input -> API
// 2026-09-28 -> 28/09/2026
function formatDateForApi(date) {

  if (!date) return "";

  // Already dd/MM/yyyy
  if (date.includes("/")) {
    return date;
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}


const emptyForm = {
  projectName: "",
  projectType: "",
  location: "",
  latitude: "",
  longitude: "",
  totalUnits: "",
  startDate: "",
  completionDate: "",
  status: "AVAILABLE",
};


export default function Projects() {

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [show, setShow] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  // ========================================================
  // LOAD PROJECTS
  // ========================================================

  async function load() {

    try {

      const { data } =
        await api.get("/projects");

      setRows(
        Array.isArray(data)
          ? data
          : data?.content || []
      );

    } catch (error) {

      console.error(
        "Failed to load projects:",
        error
      );

      setRows([]);
    }
  }


  useEffect(() => {
    load();
  }, []);


  // ========================================================
  // HANDLE CHANGE
  // ========================================================

  function handleChange(e) {

    const {
      name,
      value
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  // ========================================================
  // ADD PROJECT
  // ========================================================

  function startAdd() {

    setForm({
      ...emptyForm
    });

    setEditingId(null);

    setShow(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // ========================================================
  // EDIT PROJECT
  // ========================================================

  function startEdit(row) {

    setForm({

      projectName:
        row.projectName || "",

      projectType:
        row.projectType || "",

      location:
        row.location || "",

      latitude:
        row.latitude ?? "",

      longitude:
        row.longitude ?? "",

      totalUnits:
        row.totalUnits ?? "",

      startDate:
        formatDateForInput(
          row.startDate
        ),

      completionDate:
        formatDateForInput(
          row.completionDate
        ),

      status:
        row.status || "AVAILABLE",
    });

    setEditingId(row.id);

    setShow(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // ========================================================
  // CANCEL
  // ========================================================

  function cancelEdit() {

    setForm({
      ...emptyForm
    });

    setEditingId(null);

    setShow(false);
  }


  // ========================================================
  // SAVE
  // ========================================================

  async function save(e) {

    e.preventDefault();

    setSaving(true);

    try {

      const payload = {

        projectName:
          form.projectName,

        projectType:
          form.projectType,

        location:
          form.location,

        latitude:
          form.latitude === ""
            ? null
            : Number(form.latitude),

        longitude:
          form.longitude === ""
            ? null
            : Number(form.longitude),

        totalUnits:
          form.totalUnits === ""
            ? null
            : Number(form.totalUnits),

        startDate:
          formatDateForApi(
            form.startDate
          ),

        completionDate:
          formatDateForApi(
            form.completionDate
          ),

        status:
          form.status,
      };


      if (editingId) {

        await api.put(
          `/projects/${editingId}`,
          payload
        );

      } else {

        await api.post(
          "/projects",
          payload
        );
      }


      cancelEdit();

      await load();

    } catch (error) {

      console.error(
        "Failed to save project:",
        error
      );

      // Show backend error if available
      alert(
        error.response?.data?.message ||
        "Failed to save project"
      );

    } finally {

      setSaving(false);

    }
  }


  // ========================================================
  // SEARCH
  // ========================================================

  const filteredRows =
    rows.filter((row) => {

      if (!search.trim()) {
        return true;
      }

      const value =
        `${row.projectName || ""} ${
          row.location || ""
        }`;

      return value
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });


  // ========================================================
  // TABLE
  // ========================================================

  const tableRows =
    filteredRows.map((row) => [

      row.projectName || "-",

      row.projectType || "-",

      row.location || "-",

      row.totalUnits ?? "-",

      row.startDate || "-",

      row.completionDate || "-",

      <span
        className={`badge ${
          row.status === "AVAILABLE"
            ? "active"
            : row.status === "SOLD"
            ? "inactive"
            : ""
        }`}
      >
        {row.status || "-"}
      </span>,

      <div
        className="table-actions"
      >

        <button
          type="button"
          className="table-link"
          onClick={() =>
            startEdit(row)
          }
        >
          Edit
        </button>

        <button
          type="button"
          className="table-link"
          onClick={() =>
            navigate(
              `/projects/${row.id}/inventory`
            )
          }
        >
          Inventory
        </button>

        <button
            type="button"
            className="table-link"
            onClick={() =>
            navigate(`/projects/${row.id}/media`)
            }
        >
            Media
        </button>

      </div>,

    ]);


  // ========================================================
  // JSX
  // ========================================================

  return (
    <>

      <PageHeader
        title="Projects"
        subtitle="Manage projects and their project inventory."
        action={
          <button
            type="button"
            className="btn primary"
            onClick={() =>
              show
                ? cancelEdit()
                : startAdd()
            }
          >
            {show
              ? "Cancel"
              : "+ Add Project"}
          </button>
        }
      />


      {/* ================================================
          ADD / EDIT PROJECT
      ================================================= */}

      {show && (

        <div className="panel">

          <h3>
            {editingId
              ? "Edit Project"
              : "Add Project"}
          </h3>


          <form
            className="form-grid"
            onSubmit={save}
          >

            {/* Project Name */}

            <label>
              Project Name

              <input
                type="text"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                required
              />

            </label>


            {/* Project Type */}

            <label>
              Project Type

              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Project Type
                </option>

                <option value="PLOTS">
                  Plots
                </option>

                <option value="VILLA">
                  Villa
                </option>

                <option value="APRATMENT">
                  Apartment
                </option>

                <option value="COMMERCIAL">
                  Commercial
                </option>

              </select>

            </label>


            {/* Location */}

            <label>
              Location

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
              />

            </label>


            {/* Total Units */}

            <label>
              Total Units

              <input
                type="number"
                name="totalUnits"
                value={form.totalUnits}
                onChange={handleChange}
              />

            </label>


            {/* Latitude */}

            <label>
              Latitude

              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
              />

            </label>


            {/* Longitude */}

            <label>
              Longitude

              <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
              />

            </label>


            {/* Start Date */}

            <label>
              Start Date

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />

            </label>


            {/* Completion Date */}

            <label>
              Completion Date

              <input
                type="date"
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
              />

            </label>


            {/* Status */}

            <label>
              Status

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="RESERVED">
                  Reserved
                </option>

                <option value="SOLD">
                  Sold
                </option>

              </select>

            </label>


            {/* Buttons */}

            <div className="form-actions">

              <button
                type="submit"
                className="btn primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Save"}
              </button>


              <button
                type="button"
                className="btn secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================================================
          SEARCH
      ================================================= */}

      <div className="panel">

        <div className="filter-bar">

          <div className="u-3">

            <label>
              Search

              <input
                type="text"
                placeholder="Search project name or location"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </label>

          </div>

        </div>

      </div>


      {/* ================================================
          PROJECT LIST
      ================================================= */}

      <div className="panel">

        <DataTable

          columns={[
            "Project Name",
            "Type",
            "Location",
            "Total Units",
            "Start Date",
            "Completion Date",
            "Status",
            "Actions",
          ]}

          rows={tableRows}

        />

      </div>

    </>
  );
}