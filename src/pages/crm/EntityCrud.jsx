import React, { useEffect, useState } from "react";
import {
  api,
  getCustomers,
  getInventory,
} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function EntityCrud({
  title,
  endpoint,
  fields,
  searchField = "",
  searchPlaceholder = "Search",
}) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [inventories, setInventories] = useState([]);

  // -----------------------------------------
  // Normalize fields
  // -----------------------------------------

  const normalizedFields = fields.map((field) => {
    if (typeof field === "string") {
      return {
        name: field,
        label: field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (x) => x.toUpperCase()),
        type: "text",
      };
    }

    return field;
  });

  // -----------------------------------------
  // Load main data
  // -----------------------------------------

  async function load() {
    setLoading(true);

    try {
      const { data } = await api.get(endpoint);

      setRows(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (error) {
      console.error(`Failed to load ${title}:`, error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // Load customers
  // -----------------------------------------

  async function loadCustomers() {
    try {
      const { data } = await getCustomers();

      setCustomers(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    }
  }

  // -----------------------------------------
  // Load inventories
  // -----------------------------------------

  async function loadInventories() {
    try {
      const { data } = await getInventory();

      setInventories(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (error) {
      console.error("Failed to load inventories:", error);
      setInventories([]);
    }
  }

  // -----------------------------------------
  // Initial load
  // -----------------------------------------

  useEffect(() => {
    load();

    const hasCustomerField = normalizedFields.some(
      (field) => field.type === "customer"
    );

    const hasInventoryField = normalizedFields.some(
      (field) => field.type === "inventory"
    );

    if (hasCustomerField) {
      loadCustomers();
    }

    if (hasInventoryField) {
      loadInventories();
    }
  }, [endpoint]);

  // -----------------------------------------
  // Handle input change
  // -----------------------------------------

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // -----------------------------------------
  // Add
  // -----------------------------------------

  function startAdd() {
    setForm({});
    setEditingId(null);
    setShow(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // -----------------------------------------
  // Edit
  // -----------------------------------------

  function startEdit(row) {
    const values = {};

    normalizedFields.forEach((field) => {
      const key = field.name;

      // Customer
      if (field.type === "customer") {
        if (row.customer) {
          values.customerId = row.customer.id;
        } else if (row.customerId != null) {
          values.customerId = row.customerId;
        } else {
          values.customerId = "";
        }

        return;
      }

      // Inventory
      if (field.type === "inventory") {
        if (row.inventory) {
          values.inventoryId = row.inventory.id;
        } else if (row.inventoryId != null) {
          values.inventoryId = row.inventoryId;
        } else {
          values.inventoryId = "";
        }

        return;
      }

      values[key] = row[key] ?? "";
    });

    setForm(values);
    setEditingId(row.id);
    setShow(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // -----------------------------------------
  // Cancel
  // -----------------------------------------

  function cancelEdit() {
    setForm({});
    setEditingId(null);
    setShow(false);
  }

  // -----------------------------------------
  // Save / Update
  // -----------------------------------------

  async function save(e) {
    e.preventDefault();

    setSaving(true);

    try {
      if (editingId) {
        await api.put(
          `${endpoint}/${editingId}`,
          form
        );
      } else {
        await api.post(
          endpoint,
          form
        );
      }

      setForm({});
      setEditingId(null);
      setShow(false);

      await load();
    } catch (error) {
      console.error(
        `Failed to save ${title}:`,
        error
      );
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------------------
  // Search
  // -----------------------------------------

  const filteredRows = rows.filter((row) => {
    if (
      !searchField ||
      !search.trim()
    ) {
      return true;
    }

    const value = row[searchField];

    return String(value || "")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // -----------------------------------------
  // Render field
  // -----------------------------------------

  function renderField(field) {
    const {
      name,
      label,
      type = "text",
      options = [],
    } = field;

    // ---------------------------------------
    // Customer dropdown
    // ---------------------------------------

    if (type === "customer") {
      return (
        <label key={name}>
          {label}

          <select
            name="customerId"
            value={form.customerId || ""}
            onChange={handleChange}
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
                {customer.phone
                  ? ` - ${customer.phone}`
                  : ""}
              </option>
            ))}
          </select>
        </label>
      );
    }

    // ---------------------------------------
    // Inventory dropdown
    // ---------------------------------------

    if (type === "inventory") {
      return (
        <label key={name}>
          {label}

          <select
            name="inventoryId"
            value={form.inventoryId || ""}
            onChange={handleChange}
          >
            <option value="">
              Select Inventory
            </option>

            {inventories.map((inventory) => (
              <option
                key={inventory.id}
                value={inventory.id}
              >
                {inventory.title}
                {inventory.location
                  ? ` - ${inventory.location}`
                  : ""}
              </option>
            ))}
          </select>
        </label>
      );
    }

    // ---------------------------------------
    // Textarea
    // ---------------------------------------

    if (type === "textarea") {
      return (
        <label key={name}>
          {label}

          <textarea
            name={name}
            rows="3"
            value={form[name] || ""}
            onChange={handleChange}
          />
        </label>
      );
    }

    // ---------------------------------------
    // Select
    // ---------------------------------------

    if (type === "select") {
      return (
        <label key={name}>
          {label}

          <select
            name={name}
            value={form[name] || ""}
            onChange={handleChange}
          >
            <option value="">
              Select {label}
            </option>

            {options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </label>
      );
    }

    // ---------------------------------------
    // Normal input
    // ---------------------------------------

    return (
      <label key={name}>
        {label}

        <input
          type={type}
          name={name}
          value={form[name] || ""}
          onChange={handleChange}
        />
      </label>
    );
  }

  // -----------------------------------------
  // Table headers
  // -----------------------------------------

  const headers = normalizedFields.map(
    (field) => field.label
  );

  // -----------------------------------------
  // Table rows
  // -----------------------------------------

  const tableRows = filteredRows.map((row) => [
    ...normalizedFields.map((field) => {
      const value = row[field.name];

      // Customer display
      if (field.type === "customer") {
        return (
          row.customerName ||
          row.customer?.name ||
          "-"
        );
      }

      // Inventory display
      if (field.type === "inventory") {
        return (
          row.inventoryTitle ||
          row.inventory?.title ||
          "-"
        );
      }

      // Textarea display
      if (field.type === "textarea") {
        return (
          <div
            key={field.name}
            className="task-details"
          >
            {value || "-"}
          </div>
        );
      }

      return value ?? "-";
    }),

    // Actions
    <div
      key={`actions-${row.id}`}
      className="table-actions"
    >
      <button
        type="button"
        className="table-link"
        onClick={() => startEdit(row)}
      >
        Edit
      </button>
    </div>,
  ]);

  // -----------------------------------------
  // JSX
  // -----------------------------------------

  return (
    <>
      <PageHeader
        title={title}
        subtitle={`Add, list, update and view ${title.toLowerCase()}.`}
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
            {show ? "Cancel" : "+ Add"}
          </button>
        }
      />

      {/* Add / Edit Form */}

      {show && (
        <div className="panel">
          <h3>
            {editingId
              ? `Edit ${title.replace(/s$/, "")}`
              : `Add ${title.replace(/s$/, "")}`}
          </h3>

          <form
            className="form-grid"
            onSubmit={save}
          >
            {normalizedFields.map(renderField)}

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

      {/* Search */}

      {searchField && (
        <div className="panel">
          <div className="filter-bar">
            <div className="u-3">
              <label>
                Search

                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* List */}

      <div className="panel">
        <DataTable
          columns={[
            ...headers,
            "Actions",
          ]}
          rows={tableRows}
        />

       
      </div>
    </>
  );
}