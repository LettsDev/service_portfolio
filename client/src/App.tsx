import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./App.css";
import axios from "axios";

function App() {
  useEffect(() => {
    authenticate();
  }, []);
  async function authenticate() {
    await axios.post("/api/session", {
      email: "test@gmail.com",
      password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
    });
  }
  // authenticate().then(async () => {
  //   await getLocationData();
  // });

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-lg"
            >
              <li>
                <NavLink to="/calendar">Calendar</NavLink>
              </li>
              <li>
                <NavLink to="/table">Tables</NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/home" className="btn btn-ghost normal-case text-xl">
            Resource Manager
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-lg">
            <li>
              <NavLink to="/calendar">Calendar</NavLink>
            </li>
            <li>
              <NavLink to="/table">Tables</NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {/* logout */}
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
              {/* TODO put in initials of logged in user */}
              <span className="text-xl">JL</span>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default App;
