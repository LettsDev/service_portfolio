// import { useEffect } from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/auth.provider";
import { useAlert } from "./context/alert.provider";
import { useNavigate } from "react-router-dom";
import AlertComponent from "./components/alert";
import ThemePicker, { themes } from "./components/themePicker";
function App() {
  const { alerts } = useAlert();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme && themes.includes(localTheme)) {
      //in case the theme stored in localStorage is altered
      setTheme(localTheme);
    }
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <main data-theme={theme}>
      {isAuthenticated() ? (
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
          <div className="navbar-end flex gap-2">
            {/* Theme */}

            <ThemePicker setTheme={setTheme} />
            {/* logout */}
            <div
              className="avatar placeholder tooltip tooltip-left cursor-pointer"
              data-tip={`${
                user ? `Logout  ${user.first_name} ${user.last_name}` : "Logout"
              }`}
              onClick={handleLogout}
            >
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-lg">
                  {user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Outlet />
      <div className="flex flex-col gap-1 px-64">
        {alerts.map((alert) => (
          <AlertComponent alert={alert} key={alert.id} />
        ))}
      </div>
    </main>
  );
}

export default App;
