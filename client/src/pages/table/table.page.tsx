import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function TablePage() {
  const [activeTab, setActiveTab] = useState("locations");
  const tables = ["locations", "resources", "services"];
  return (
    <>
      <div className="flex justify-center w-full ">
        {/* table nav */}
        <ul className="tabs tabs-boxed">
          {tables.map((table) => (
            <li
              key={table}
              className={
                "tab tab-lg " + (activeTab === table ? "tab-active" : "")
              }
              onClick={() => setActiveTab(table)}
            >
              <Link to={`/table/${table}`}>{table}</Link>
            </li>
          ))}
        </ul>
      </div>

      <Outlet />
    </>
  );
}
