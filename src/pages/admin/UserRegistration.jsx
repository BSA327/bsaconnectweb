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
  email: "",
  phone: "",
  username: "",
  password: "",
  aadharNumber: "",
  joiningDate: "",
  role: "BDM",
  active: true,
};

function formatError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string" ? error.response.data : null) ||
    error?.message ||
    "Unable to complete the request."
  );
}

export default function UserRegistration() {
  const [form, setForm] = useState(emptyForm);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const { data } = await getUsers();
      setRows(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function startEdit(user) {
    setEditingId(user.id ?? user.userId);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      username: user.username || "",
      password: "",
      aadharNumber: user.aadharNumber || "",
      joiningDate: user.joiningDate || "",
      role: user.role ? String(user.role).replace("ROLE_", "").toUpperCase() : "BDM",
      active: user.active !== false,
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const wasEditing = Boolean(editingId);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        username: form.username.trim(),
        aadharNumber: form.aadharNumber.trim(),
        joiningDate: form.joiningDate,
        role: form.role,
        active: form.active,
      };

      // Password is required for a new user. During edit, leave it out when blank
      // so the existing password is not replaced.
      if (!editingId || form.password.trim()) {
        payload.password = form.password;
      }

      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser({ ...payload, password: form.password });
        setSuccess("User registered successfully.");
      }

      resetForm();
      setSuccess(wasEditing ? "User updated successfully." : "User registered successfully.");
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(id) {
    if (!id || !window.confirm("Delete this user?")) return;

    setError("");
    setSuccess("");
    try {
      await deleteUser(id);
      if (editingId === id) resetForm();
      setSuccess("User deleted successfully.");
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    }
  }

  return (
    <>
      <PageHeader
        title={editingId ? "Edit User" : "User Registration"}
        subtitle="Create and manage ADMIN, CRM and BDM users."
      />

      {(error || success) && (
        <div className={`alert ${error ? "error" : "success"}`}>
          {error || success}
        </div>
      )}

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>{editingId ? "Update User" : "Register New User"}</h3>
            <p>Enter employee details and assign the application role.</p>
          </div>
          {editingId && (
            <button type="button" className="btn secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form className="form-grid" onSubmit={save}>
          <label>
            Name *
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Email *
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Phone *
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>

          <label>
            Username *
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>

          <label>
            Password {editingId ? "(leave blank to keep current password)" : "*"}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              autoComplete="new-password"
            />
          </label>

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

          <label>
            Role *
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="ADMIN">ADMIN</option>
              <option value="CRM">CRM</option>
              <option value="BDM">BDM</option>
            </select>
          </label>

          <label className="checkbox-field">
            <input
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={handleChange}
            />
            Active User
          </label>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update User" : "Register User"}
            </button>
            <button className="btn secondary" type="button" onClick={resetForm} disabled={saving}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Users</h3>
            <p>{loading ? "Loading users..." : `${rows.length} user${rows.length === 1 ? "" : "s"}`}</p>
          </div>
          <button className="btn secondary" type="button" onClick={loadUsers} disabled={loading}>
            Refresh
          </button>
        </div>

        <DataTable
          columns={["Name", "Username", "Email", "Phone", "Role", "Joining Date", "Status", "Actions"]}
          rows={rows.map((user) => {
            const id = user.id ?? user.userId;
            const role = String(user.role || "").replace("ROLE_", "").toUpperCase();
            return [
              user.name,
              user.username,
              user.email,
              user.phone,
              <span className={`badge role-${role.toLowerCase()}`}>{role || "-"}</span>,
              user.joiningDate,
              <span className={`badge ${user.active === false ? "inactive" : "active"}`}>
                {user.active === false ? "Inactive" : "Active"}
              </span>,
              <div className="table-actions">
                <button className="table-link" type="button" onClick={() => startEdit(user)}>
                  Edit
                </button>
                <button
                  className="table-link danger-text"
                  type="button"
                  onClick={() => removeUser(id)}
                >
                  Delete
                </button>
              </div>,
            ];
          })}
        />
      </div>
    </>
  );
}
