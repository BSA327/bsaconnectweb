import React, { useState } from "react";
import { checkInApi, checkOutApi } from "../../api/api";
import PageHeader from "../../components/PageHeader";

export default function Attendance() {
  const [message, setMessage] = useState("");

  function gps() {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve({});
      navigator.geolocation.getCurrentPosition(
        p => resolve({ latitude:p.coords.latitude, longitude:p.coords.longitude }),
        () => resolve({})
      );
    });
  }

  async function mark(type) {
    const position = await gps();
    try {
      if (type === "in") await checkInApi(position);
      else await checkOutApi(position);
      setMessage(type === "in" ? "Check-in recorded." : "Check-out recorded.");
    } catch (e) {
      setMessage(e.response?.data?.message ||e.response?.data || "Attendance API failed.");
    }
  }

  return <>
    <PageHeader title="Mark Attendance" subtitle="Login/logout time, GPS location and IP tracking." />
    {message && <div className="alert success">{message}</div>}
    <div className="attendance-box panel">
      <div className="attendance-actions">
        <button className="btn success" onClick={() => mark("in")}>Check In</button>
        <button className="btn danger" onClick={() => mark("out")}>Check Out</button>
      </div>
      <div className="info-grid">
        <div><small>Login time</small><b>Server timestamp</b></div>
        <div><small>Logout time</small><b>Server timestamp</b></div>
        <div><small>Login Lat/Long</small><b>Browser GPS</b></div>
        <div><small>Logout Lat/Long</small><b>Browser GPS</b></div>
        <div><small>Login IP</small><b>Backend recommended</b></div>
        <div><small>Logout IP</small><b>Backend recommended</b></div>
      </div>
    </div>
  </>;
}