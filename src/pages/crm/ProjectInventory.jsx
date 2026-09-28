import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { api } from "../../api/api";

import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";


const emptyForm = {
  projectId: "",
  unitNo: "",
  unitType: "",
  floor: "",
  area: "",
  facing: "",
  price: "",
  status: "AVAILABLE",
  remarks: "",
};


export default function ProjectInventory() {

  const { projectId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [rows, setRows] =
    useState([]);

  const [form, setForm] =
    useState({
      ...emptyForm,
      projectId,
    });

  const [show, setShow] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [saving, setSaving] =
    useState(false);


  // ========================================================
  // LOAD PROJECT + INVENTORY
  // ========================================================

  async function load() {

    try {

      const projectResponse =
        await api.get(
          `/projects/${projectId}`
        );

      setProject(
        projectResponse.data
      );


      const inventoryResponse =
        await api.get(
          `/projectinventory/project/${projectId}`
        );

      const inventoryData =
        Array.isArray(inventoryResponse.data)
          ? inventoryResponse.data
          : inventoryResponse.data?.content || [];

      setRows(inventoryData);

    } catch (error) {

      console.error(
        "Failed to load project inventory:",
        error
      );

      setRows([]);
    }
  }


  useEffect(() => {

    load();

  }, [projectId]);


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
  // ADD
  // ========================================================

  function startAdd() {

    setForm({
      ...emptyForm,
      projectId,
    });

    setEditingId(null);

    setShow(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // ========================================================
  // EDIT
  // ========================================================

  function startEdit(row) {

    setForm({

      projectId:
        row.projectId || projectId,

      unitNo:
        row.unitNo || "",

      unitType:
        row.unitType || "",

      floor:
        row.floor || "",

      area:
        row.area ?? "",

      facing:
        row.facing || "",

      price:
        row.price ?? "",

      status:
        row.status || "AVAILABLE",

      remarks:
        row.remarks || "",
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
      ...emptyForm,
      projectId,
    });

    setEditingId(null);

    setShow(false);
  }


  // ========================================================
  // SAVE / UPDATE
  // ========================================================

  async function save(e) {

    e.preventDefault();

    setSaving(true);

    try {

      const payload = {

        projectId:
          Number(projectId),

        unitNo:
          form.unitNo,

        unitType:
          form.unitType,

        floor:
          form.floor,

        area:
          form.area === ""
            ? null
            : Number(form.area),

        facing:
          form.facing,

        price:
          form.price === ""
            ? null
            : Number(form.price),

        status:
          form.status,

        remarks:
          form.remarks,
      };


      let response;


      // ====================================================
      // UPDATE
      // ====================================================

      if (editingId) {

        response = await api.put(
          `/projectinventory/${editingId}`,
          payload
        );


        // Immediately update existing row
        setRows((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? response.data
              : item
          )
        );

      }


      // ====================================================
      // CREATE
      // ====================================================

      else {

        response = await api.post(
          "/projectinventory",
          payload
        );


        // Immediately add new row
        if (response.data) {

          setRows((prev) => [
            ...prev,
            response.data,
          ]);

        }

      }


      // ====================================================
      // RESET FORM
      // ====================================================

      setForm({
        ...emptyForm,
        projectId,
      });

      setEditingId(null);

      setShow(false);


      // ====================================================
      // RELOAD FROM SERVER
      // ====================================================

      await load();


    } catch (error) {

      console.error(
        "Failed to save project inventory:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save project inventory"
      );

    } finally {

      setSaving(false);
    }
  }


  // ========================================================
  // TABLE ROWS
  // ========================================================

  const tableRows =
    rows.map((row) => [

      row.unitNo || "-",

      row.unitType || "-",

      row.floor || "-",

      row.area ?? "-",

      row.facing || "-",

      row.price != null
        ? `₹ ${row.price}`
        : "-",

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

      </div>,

    ]);


  // ========================================================
  // LOADING
  // ========================================================

  if (!project) {

    return (
      <div>
        Loading...
      </div>
    );

  }


  // ========================================================
  // JSX
  // ========================================================

  return (
    <>

      <PageHeader

        title={`${project.projectName}`}

        subtitle={
          `Manage inventory units for ${project.projectName}.`
        }

        action={

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            <button
              type="button"
              className="btn secondary"
              onClick={() =>
                navigate("/projects")
              }
            >
              Back
            </button>


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
                : "+ Add Unit"}
            </button>

          </div>

        }

      />


      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}

      {show && (

        <div className="panel">

          <h3>
            {editingId
              ? "Edit Project Inventory"
              : "Add Project Inventory"}
          </h3>


          <form
            className="form-grid"
            onSubmit={save}
          >

            {/* UNIT NO */}

            <label>

              Unit No

              <input
                type="text"
                name="unitNo"
                value={form.unitNo}
                onChange={handleChange}
                placeholder="Villa-001"
                required
              />

            </label>


            {/* UNIT TYPE */}

            <label>

              Unit Type

              <select
                name="unitType"
                value={form.unitType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Unit Type
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


            {/* FLOOR */}

            <label>

              Floor

              <input
                type="text"
                name="floor"
                value={form.floor}
                onChange={handleChange}
              />

            </label>


            {/* AREA */}

            <label>

              Area

              <input
                type="number"
                step="any"
                name="area"
                value={form.area}
                onChange={handleChange}
              />

            </label>


            {/* FACING */}

            <label>

              Facing

              <input
                type="text"
                name="facing"
                value={form.facing}
                onChange={handleChange}
                placeholder="East"
              />

            </label>


            {/* PRICE */}

            <label>

              Price

              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
              />

            </label>


            {/* STATUS */}

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


            {/* REMARKS */}

            <label>

              Remarks

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows="3"
              />

            </label>


            {/* BUTTONS */}

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


      {/* ==================================================
          INVENTORY TABLE
      ================================================== */}

      <div className="panel">

        <DataTable

          columns={[
            "Unit No",
            "Type",
            "Floor",
            "Area",
            "Facing",
            "Price",
            "Status",
            "Actions",
          ]}

          rows={tableRows}

          empty="No project inventory found."

        />

      </div>

    </>
  );
}