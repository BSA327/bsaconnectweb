import React, { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

const emptyForm = {
  name: "",
  gender: "",
  email: "",
  phone: "",
  communicationAddress: "",
  username: "",
  aadharNumber: "",
  joiningDate: "",
  role: "BDM",
};

function formatError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string"
      ? error.response.data
      : null) ||
    error?.message ||
    "Unable to complete the request."
  );
}

/*
 * Backend:
 * [2026, 9, 24]
 *
 * HTML date:
 * 2026-09-24
 */
function formatDateForInput(date) {
  if (!date) {
    return "";
  }

  if (Array.isArray(date) && date.length >= 3) {
    const [year, month, day] = date;

    return `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  if (typeof date === "string") {
    return date.substring(0, 10);
  }

  return "";
}

/*
 * HTML date:
 * 2026-09-26
 *
 * Backend LocalDate expects:
 * 26/09/2026
 */
function formatDateForBackend(date) {
  if (!date) {
    return null;
  }

  return date.split("-").reverse().join("/");
}

export default function UserRegistration() {
  const [form, setForm] = useState({ ...emptyForm });

  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * ============================
   * LOAD USERS
   * ============================
   */
  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const { data } = await getUsers();

      setRows(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /*
   * ============================
   * HANDLE CHANGE
   * ============================
   */
  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  }

  /*
   * ============================
   * RESET
   * ============================
   */
  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  /*
   * ============================
   * EDIT USER
   * ============================
   */
  function startEdit(user) {
    const employee = user.employee || {};

    setEditingId(user.id);

    setForm({
      name: employee.name || "",

      gender:
        employee.gender !== null &&
        employee.gender !== undefined
          ? String(employee.gender)
          : "",

      email: employee.emailId || "",

      phone: employee.mobileNumber || "",

      communicationAddress:
        employee.communicationAddress || "",

      username: user.userName || "",

      aadharNumber:
        employee.aadharNumber || "",

      joiningDate: formatDateForInput(
        employee.joiningDate
      ),

      role: user.role
        ? String(user.role)
            .replace("ROLE_", "")
            .toUpperCase()
        : "BDM",

    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * ============================
   * SAVE USER
   * ============================
   */
  async function save(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const wasEditing = Boolean(editingId);

      const payload = {
        name: form.name.trim(),

        gender: form.gender
          ? Number(form.gender)
          : null,

        email: form.email.trim(),

        phone: form.phone.trim(),

        communicationAddress:
          form.communicationAddress.trim(),

        username: form.username.trim(),

        aadharNumber:
          form.aadharNumber.trim(),

        joiningDate: formatDateForBackend(
          form.joiningDate
        ),

        role: form.role,
      };

      /*
       * NEW USER:
       * Password = Username
       *
       * EDIT:
       * Password is not sent.
       */
      if (!editingId) {
        payload.password =
          form.username.trim();
      }

      if (editingId) {
        await updateUser(
          editingId,
          payload
        );
      } else {
        await createUser(payload);
      }

      resetForm();

      setSuccess(
        wasEditing
          ? "User updated successfully."
          : "User registered successfully."
      );

      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  }

  /*
   * ============================
   * DELETE USER
   * ============================
   */
  async function removeUser(id) {
    if (
      !id ||
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteUser(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccess(
        "User deleted successfully."
      );

      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    }
  }

  /*
   * ============================
   * RENDER
   * ============================
   */
  return (
    <>
      <PageHeader
        title={
          editingId
            ? "Edit User"
            : "User Registration"
        }
        subtitle="Create and manage ADMIN, CRM and BDM users."
      />

      {/* MESSAGE */}
      {(error || success) && (
        <div
          className={`alert ${
            error
              ? "error"
              : "success"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* ============================
          USER FORM
      ============================ */}
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>
              {editingId
                ? "Update User"
                : "Register New User"}
            </h3>

            <p>
              Enter employee details and
              assign the application role.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="btn secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          className="form-grid"
          onSubmit={save}
        >
          {/* NAME */}
          <label>
            Name *

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          {/* GENDER */}
          <label>
            Gender *

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Gender
              </option>

              <option value="1">
                Male
              </option>

              <option value="2">
                Female
              </option>
            </select>
          </label>

          {/* EMAIL */}
          <label>
            Email *

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          {/* PHONE */}
          <label>
            Phone *

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          

          

          {/* AADHAAR */}
          <label>
            Aadhaar Number *

            <input
              name="aadharNumber"
              value={form.aadharNumber}
              onChange={handleChange}
              maxLength={12}
              required
            />
          </label>

          {/* JOINING DATE */}
          <label>
            Joining Date *

            <input
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              required
            />
          </label>

          {/* USERNAME */}
          <label>
            Username *

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          {/* ROLE */}
          <label>
            Role *

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">
                ADMIN
              </option>

              <option value="CRM">
                CRM
              </option>

              <option value="BDM">
                BDM
              </option>
            </select>
          </label>

          {/* COMMUNICATION ADDRESS */}
          <label className="full-width">
            Communication Address *

            <textarea
              name="communicationAddress"
              value={
                form.communicationAddress
              }
              onChange={handleChange}
              rows="3"
              required
            />
          </label>

         

          {/* ACTIONS */}
          <div className="form-actions">
            <button
              className="btn primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update User"
                : "Register User"}
            </button>

            <button
              className="btn secondary"
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* ============================
          USERS TABLE
      ============================ */}
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Users</h3>

            <p>
              {loading
                ? "Loading users..."
                : `${rows.length} user${
                    rows.length === 1
                      ? ""
                      : "s"
                  }`}
            </p>
          </div>

          <button
            className="btn secondary"
            type="button"
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        <DataTable
          columns={[
            "Name",
            "Username",
            "Email",
            "Phone",
            "Role",
            "Joining Date",
            "Status",
            "Actions",
          ]}
          rows={rows.map(
            (user) => {
              const employee =
                user.employee || {};

              const id = user.id;

              const role = String(
                user.role || ""
              )
                .replace(
                  "ROLE_",
                  ""
                )
                .toUpperCase();

              const joiningDate =
                formatDateForInput(
                  employee.joiningDate
                );

              return [
                employee.name || "-",

                user.userName || "-",

                employee.emailId || "-",

                employee.mobileNumber ||
                  "-",

                <span
                  key={`role-${id}`}
                  className={`badge role-${role.toLowerCase()}`}
                >
                  {role || "-"}
                </span>,

                joiningDate || "-",

                <span
                  key={`status-${id}`}
                  className={`badge ${
                    user.active === false
                      ? "inactive"
                      : "active"
                  }`}
                >
                  {user.active === false
                    ? "Inactive"
                    : "Active"}
                </span>,

                <div
                  key={`actions-${id}`}
                  className="table-actions"
                >
                  <button
                    className="table-link"
                    type="button"
                    onClick={() =>
                      startEdit(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="table-link danger-text"
                    type="button"
                    onClick={() =>
                      removeUser(id)
                    }
                  >
                    Delete
                  </button>
                </div>,
              ];
            }
          )}
        />
      </div>
    </>
  );
}
