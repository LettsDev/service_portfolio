import { Link, Outlet, useLocation } from "react-router-dom";

export default function TablePage() {
  const tables = ["locations", "resources", "services"];
  const location = useLocation();

  return (
    <>
      <div className="flex justify-center w-full ">
        {/* table nav */}
        <ul className="tabs tabs-boxed">
          {tables.map((table) => (
            <li
              key={table}
              className={
                "tab tab-lg " +
                (location.pathname === `/table/${table}` ? "tab-active" : "")
              }
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
