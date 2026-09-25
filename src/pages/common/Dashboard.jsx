import React from "react";
import { Link } from "react-router-dom";
import { Building2, Contact, FileText, MapPin } from "lucide-react";
import { getRole, getUser } from "../../auth";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const user = getUser();
  const cards = [
    ["Customers", "/customers", Contact, "24"],
    ["Inventory", "/inventory", Building2, "12"],
    ["Enquiries", "/enquiries", FileText, "18"],
    ["Site Visits", "/site-visits", MapPin, "9"]
  ];

  return <>
    <PageHeader title={`Welcome, ${user?.loginName || "User"}`} subtitle={`Logged in as ${getRole()}.`} />
    <div className="stats-grid">
      {cards.map(([name, to, Icon, count]) => (
        <Link className="stat-card" to={to} key={name}>
          <div className="stat-icon"><Icon size={21}/></div>
          <div><small>{name}</small><strong>{count}</strong></div>
        </Link>
      ))}
    </div>
    <div className="panel">
      <h3>System overview</h3>
      <p className="muted">Use the navigation to manage customers, agents/CP, inventory, enquiries, tasks, attendance and site visits.</p>
    </div>
  </>;
}