import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../../api/api";
import PageHeader from "../../components/PageHeader";

export default function PasswordUpdate() {

  const navigate = useNavigate();

  const [f, setF] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");

  async function save(e) {
    e.preventDefault();

    setMsg("");

    if (f.newPassword !== f.confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    try {

      await changePasswordApi({
        oldPassword: f.oldPassword,
        newPassword: f.newPassword,
      });

      // Logout after successful password update
      localStorage.removeItem("bsa_token");
      localStorage.removeItem("bsa_user");

      // Redirect to login
      navigate("/login", {
        replace: true,
      });

    } catch (e) {

      setMsg(
        e.response?.data?.message ||
        "Password update failed."
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Change Password"
        subtitle="Update your login password."
      />

      <div className="panel narrow">

        <form onSubmit={save}>

          <label>
            Current Password

            <input
              required
              type="password"
              value={f.oldPassword}
              onChange={(e) =>
                setF({
                  ...f,
                  oldPassword: e.target.value,
                })
              }
            />
          </label>

          <label>
            New Password

            <input
              required
              type="password"
              value={f.newPassword}
              onChange={(e) =>
                setF({
                  ...f,
                  newPassword: e.target.value,
                })
              }
            />
          </label>

          <label>
            Confirm Password

            <input
              required
              type="password"
              value={f.confirmPassword}
              onChange={(e) =>
                setF({
                  ...f,
                  confirmPassword: e.target.value,
                })
              }
            />
          </label>

          <button
            type="submit"
            className="btn primary"
          >
            Update Password
          </button>

        </form>

        {msg && (
          <div className="alert success">
            {msg}
          </div>
        )}

      </div>
    </>
  );
}