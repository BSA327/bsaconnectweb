import React, { useEffect, useState } from "react";
import { createTask, getMyTasks } from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function MyTasks() {
  const [form, setForm] = useState({
    date: "",
    details: "",
  });

  const [rows, setRows] = useState([]);

  /*
   * ==========================================================
   * Convert HTML date (yyyy-MM-dd) to API date (dd/MM/yyyy)
   * ==========================================================
   */
  function formatDateForApi(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  /*
   * ==========================================================
   * Convert API date to display format
   * ==========================================================
   */
  function formatDateForDisplay(date) {
    if (!date) return "";

    // Already dd/MM/yyyy
    if (date.includes("/")) {
      return date;
    }

    // yyyy-MM-dd
    if (date.includes("-")) {
      const [year, month, day] = date.split("-");

      return `${day}/${month}/${year}`;
    }

    return date;
  }

  /*
   * ==========================================================
   * LOAD TASKS
   * ==========================================================
   */
  async function load() {
    try {
      const { data } = await getMyTasks();

      setRows(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (e) {
      console.error(
        "Unable to load tasks",
        e
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  /*
   * ==========================================================
   * SAVE TASK
   * ==========================================================
   */
  async function save(e) {
    e.preventDefault();

    try {
      const payload = {
        date: formatDateForApi(
          form.date
        ),
        details: form.details.trim(),
      };

      await createTask(payload);

      setForm({
        date: "",
        details: "",
      });

      await load();
    } catch (e) {
      console.error(
        "Unable to create task",
        e
      );
    }
  }

  return (
    <>
      <PageHeader
        title="My Tasks"
        subtitle="Create and manage your tasks."
      />

      {/* ==================================================
          ADD TASK
      =================================================== */}

      <div className="panel">
        <h3>Add Task</h3>

        <form onSubmit={save}>
          <div className="filter-bar">
          <label>
            Date

            <input
              required
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
            />
          </label>
          </div>

          <label>
            Details

            <textarea
              required
              rows="5"
              value={form.details}
              onChange={(e) =>
                setForm({
                  ...form,
                  details: e.target.value,
                })
              }
            />
          </label>

          <button
            type="submit"
            className="btn primary"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* ==================================================
          TASK LIST
      =================================================== */}

      <div className="panel">
        <h3>My Task List</h3>

        <DataTable
          columns={[
            "Date",
            "Details",
          ]}
          rows={rows.map((r) => [
            formatDateForDisplay(
              r.date || r.taskDate
            ),

            <div className="task-details">
              {r.details}
            </div>,
          ])}
        />
      </div>
    </>
  );
}
