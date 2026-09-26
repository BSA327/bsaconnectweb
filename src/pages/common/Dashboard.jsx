import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Contact,
  FileText,
  MapPin,
} from "lucide-react";

import { getRole, getUser } from "../../auth";
import { getDashboardStatics } from "../../api/api";

import PageHeader from "../../components/PageHeader";

export default function Dashboard() {

  const user = getUser();

  const [stats, setStats] = useState([]);

  async function loadStatics() {
    try {
      const { data } = await getDashboardStatics();

      setStats(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load dashboard statistics:",
        error
      );

      setStats([]);
    }
  }

  useEffect(() => {
    loadStatics();
  }, []);

  const cards = [
    {
      name: "Customers",
      to: "/customers",
      icon: Contact,
      apiName: "Customers",
    },
    {
      name: "Inventory",
      to: "/inventory",
      icon: Building2,
      apiName: "Inventories",
    },
    {
      name: "Enquiries",
      to: "/enquiries",
      icon: FileText,
      apiName: "Total Enquiry",
    },
    {
      name: "Site Visits",
      to: "/site-visits",
      icon: MapPin,
      apiName: "Site Visits",
    },
  ];

  function getCount(apiName) {
    const item = stats.find(
      (stat) => stat.name === apiName
    );

    return item?.totalCount ?? 0;
  }

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.loginName || "User"}`}
        subtitle={`Logged in as ${getRole()}.`}
      />

      <div className="stats-grid">

        {cards.map(
          ({
            name,
            to,
            icon: Icon,
            apiName,
          }) => (

            <Link
              className="stat-card"
              to={to}
              key={name}
            >

              <div className="stat-icon">
                <Icon size={21} />
              </div>

              <div>
                <small>{name}</small>

                <strong>
                  {getCount(apiName)}
                </strong>
              </div>

            </Link>

          )
        )}

      </div>

      <div className="panel">
        <h3>System overview</h3>

        <p className="muted">
          Use the navigation to manage customers,
          agents/CP, inventory, enquiries, tasks,
          attendance and site visits.
        </p>
      </div>
    </>
  );
}