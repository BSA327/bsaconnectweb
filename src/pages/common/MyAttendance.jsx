import React, { useEffect, useState } from "react";
import { getMyAttendance } from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function MyAttendance() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [rows, setRows] = useState([]);

  async function load() {
    try {
      const {data} = await getMyAttendance({month});
      setRows(Array.isArray(data) ? data : data.content || []);
    } catch { setRows([]); }
  }

  useEffect(() => { load(); }, [month]);

  return <>
    <PageHeader title="My Attendance" subtitle="Monthly attendance history." />
    <div className="panel filter-bar">
      <label>Month<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label>
    </div>
    <div className="panel">
      <DataTable
        columns={["Date","Login","Logout"]}
        rows={rows.map(r=>[
          r.attendanceDate,r.loginTime,r.logoutTime
         ])}
      />
    </div>
  </>;
}