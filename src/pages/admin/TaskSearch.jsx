import React,{useState} from "react";
import {searchTasks} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function TaskSearch(){
  const [f,setF]=useState({employeeId:"",fromDate:"",toDate:""});const [rows,setRows]=useState([]);
  async function search(){try{const {data}=await searchTasks(f);setRows(Array.isArray(data)?data:data.content||[])}catch{setRows([])}}
  return <>
    <PageHeader title="Task Search" subtitle="Search employee tasks between dates."/>
    <div className="panel filter-bar">
      <label>Employee ID<input value={f.employeeId} onChange={e=>setF({...f,employeeId:e.target.value})}/></label>
      <label>From<input type="date" value={f.fromDate} onChange={e=>setF({...f,fromDate:e.target.value})}/></label>
      <label>To<input type="date" value={f.toDate} onChange={e=>setF({...f,toDate:e.target.value})}/></label>
      <button className="btn primary" onClick={search}>Search</button>
    </div>
    <div className="panel"><DataTable columns={["Employee","Date","Details","Status"]} rows={rows.map(r=>[r.employeeName||r.userId,r.date||r.taskDate,r.details,r.status])}/></div>
  </>;
}