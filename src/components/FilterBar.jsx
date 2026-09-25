import React from "react";
import { Search } from "lucide-react";

export default function FilterBar({ children, onSearch }) {
  return (
    <div className="panel filter-bar">
      {children}
      <button className="btn primary" onClick={onSearch}>
        <Search size={16} /> Search
      </button>
    </div>
  );
}