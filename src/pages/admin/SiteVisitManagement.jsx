import React,{useState} from "react";
import {createSiteVisit,searchSiteVisits} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function SiteVisitManagement(){
  const [form,setForm]=useState({inventoryId:"",enquiryId:"",date:"",bdmId:""});
  const [f,setF]=useState({bdmId:"",fromDate:"",toDate:""});const [rows,setRows]=useState([]);
  async function save(e){e.preventDefault();await createSiteVisit(form);alert("Site visit created.");}
  async function search(){try{const {data}=await searchSiteVisits(f);setRows(Array.isArray(data)?data:data.content||[])}catch{setRows([])}}
  return <>
    <PageHeader title="Site Visit Management" subtitle="Create and search visits. One inventory can have many site visits."/>
    <div className="panel"><h3>Create Site Visit</h3><form className="form-grid" onSubmit={save}>
      <label>Inventory ID<input required value={form.inventoryId} onChange={e=>setForm({...form,inventoryId:e.target.value})}/></label>
      <label>Enquiry ID<input required value={form.enquiryId} onChange={e=>setForm({...form,enquiryId:e.target.value})}/></label>
      <label>Visit Date<input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
      <label>BDM ID<input required value={form.bdmId} onChange={e=>setForm({...form,bdmId:e.target.value})}/></label>
      <button className="btn primary">Create Site Visit</button>
    </form></div>
    <div className="panel filter-bar">
      <label>BDM ID<input value={f.bdmId} onChange={e=>setF({...f,bdmId:e.target.value})}/></label>
      <label>From<input type="date" value={f.fromDate} onChange={e=>setF({...f,fromDate:e.target.value})}/></label>
      <label>To<input type="date" value={f.toDate} onChange={e=>setF({...f,toDate:e.target.value})}/></label>
      <button className="btn primary" onClick={search}>Search</button>
    </div>
    <div className="panel"><DataTable columns={["Inventory","Enquiry","BDM","Date","Status"]} rows={rows.map(r=>[r.inventoryName||r.inventory,r.enquiryName||r.enquiry,r.bdmName||r.bdm,r.visitDate||r.date,r.status])}/></div>
  </>;
}