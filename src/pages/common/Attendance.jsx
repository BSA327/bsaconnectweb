import React, { useState } from "react";
import { checkInApi, checkOutApi } from "../../api/api";
import PageHeader from "../../components/PageHeader";

export default function Attendance() {
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  function gps() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({});
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (p) => {
          resolve({
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          });
        },
        () => {
          // GPS failed/permission denied - continue without location
          resolve({});
        }
      );
    });
  }

  async function mark(type) {
    if (processing) return;

    setProcessing(true);
    setMessage("");

    // Show global loader while getting GPS
    window.dispatchEvent(
      new CustomEvent("api-loading", { detail: true })
    );

    try {
      const position = await gps();

      if (type === "in") {
        await checkInApi(position);
        setMessage("Check-in recorded.");
      } else {
        await checkOutApi(position);
        setMessage("Check-out recorded.");
      }
    } catch (e) {
      setMessage(
        e.response?.data?.message ||
          e.response?.data ||
          "Attendance API failed."
      );
    } finally {
      // Hide global loader
      window.dispatchEvent(
        new CustomEvent("api-loading", { detail: false })
      );

      setProcessing(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Mark Attendance"
        subtitle="Login/logout time, GPS location and IP tracking."
      />

      {message && <div className="alert success">{message}</div>}

      <div className="attendance-box panel">
        <div className="attendance-actions">
          <button
            className="btn success"
            onClick={() => mark("in")}
            disabled={processing}
          >
            Check In
          </button>

          <button
            className="btn danger"
            onClick={() => mark("out")}
            disabled={processing}
          >
            Check Out
          </button>
        </div>

        <div className="info-grid">
          <div>
            <small>Login time</small>
            <b>Server timestamp</b>
          </div>

          <div>
            <small>Logout time</small>
            <b>Server timestamp</b>
          </div>

          <div>
            <small>Login Lat/Long</small>
            <b>Browser GPS</b>
          </div>

          <div>
            <small>Logout Lat/Long</small>
            <b>Browser GPS</b>
          </div>

          <div>
            <small>Login IP</small>
            <b>Backend recommended</b>
          </div>

          <div>
            <small>Logout IP</small>
            <b>Backend recommended</b>
          </div>
        </div>
      </div>
    </>
  );
}