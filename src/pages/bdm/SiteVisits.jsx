import React,{useEffect,useState} from "react";
import {getSiteVisits,searchSiteVisits} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function SiteVisits(){
  const [rows,setRows]=useState([]);
  const [f,setF]=useState({bdmId:"",fromDate:"",toDate:""});
  async function load(){try{const {data}=await getSiteVisits();setRows(Array.isArray(data)?data:data.content||[])}catch{}}
  useEffect(()=>{load()},[]);
  async function search(){try{const {data}=await searchSiteVisits(f);setRows(Array.isArray(data)?data:data.content||[])}catch{setRows([])}}
  return <>
    <PageHeader title="Site Visits" subtitle="BDM site visits mapped to inventory. One inventory can have multiple visits."/>
    <div className="panel filter-bar">
      <label>BDM ID<input value={f.bdmId} onChange={e=>setF({...f,bdmId:e.target.value})}/></label>
      <label>From<input type="date" value={f.fromDate} onChange={e=>setF({...f,fromDate:e.target.value})}/></label>
      <label>To<input type="date" value={f.toDate} onChange={e=>setF({...f,toDate:e.target.value})}/></label>
      <button className="btn primary" onClick={search}>Search</button>
    </div>
    <div className="panel"><DataTable columns={["Inventory","Enquiry/Customer","BDM","Visit Date","Status"]} rows={rows.map(r=>[r.inventoryName||r.inventory,r.customerName||r.enquiry,r.bdmName||r.bdm,r.visitDate||r.date,r.status])}/></div>
  </>;
}