import React,{useEffect,useState} from "react";
import {api} from "../../api/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";

export default function EntityCrud({title,endpoint,fields,media}){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [show,setShow]=useState(false);
  async function load(){try{const {data}=await api.get(endpoint);setRows(Array.isArray(data)?data:data.content||[])}catch{}}
  useEffect(()=>{load()},[]);
  async function save(e){e.preventDefault();try{await api.post(endpoint,form);setForm({});setShow(false);load()}catch{}}
  const headers=fields.map(x=>x.replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase()));
  return <>
    <PageHeader title={title} subtitle={`Add, list, update and view ${title.toLowerCase()}.`}
      action={<button className="btn primary" onClick={()=>setShow(!show)}>+ Add</button>}/>
    {show&&<div className="panel"><h3>Add {title.replace(/s$/,"")}</h3><form className="form-grid" onSubmit={save}>
      {fields.map(key=><label key={key}>{key}<input type={key==="date"?"date":"text"} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}
      {media&&<label className="span-2">Images / Videos<input type="file" multiple accept="image/*,video/*"/></label>}
      <button className="btn primary">Save</button>
    </form></div>}
    <div className="panel"><DataTable columns={[...headers,"Actions"]} rows={rows.map(r=>[...fields.map(f=>r[f]),<button className="table-link">View / Edit</button>])}/></div>
  </>;
}