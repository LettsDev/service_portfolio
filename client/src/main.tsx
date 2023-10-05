import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/home/home.page.tsx";
import Calendar from "./pages/calendar/calendar.page.tsx";
import TablePage from "./pages/table/table.page.tsx";
import LocationTable from "./components/table/location/locationTable.tsx";
import "./index.css";
import Modal from "./components/modal.tsx";
import axios from "axios";
import DeleteLocationForm from "./components/table/location/forms/deleteLocationForm.tsx";
import NewLocationForm from "./components/table/location/forms/newLocationForm.tsx";
import EditLocationForm from "./components/table/location/forms/editLocationForm.tsx";
const router = createBrowserRouter([
  {
    element: <App />,
    loader: async () =>
      axios.post("/api/session", {
        email: "test@gmail.com",
        password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
      }),
    children: [
      { path: "home", element: <Home /> },
      {
        path: "table",
        element: <TablePage />,
        children: [
          {
            path: "locations",
            element: <LocationTable />,

            children: [
              {
                path: "delete/:id",
                element: (
                  <Modal showModal={true}>
                    <DeleteLocationForm />
                  </Modal>
                ),
              },
              {
                path: "new",
                element: (
                  <Modal showModal={true}>
                    <NewLocationForm />
                  </Modal>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <Modal showModal={true}>
                    <EditLocationForm />
                  </Modal>
                ),
              },
            ],
          },
          { path: "resources", element: <></> },
          { path: "services", element: <></> },
        ],
      },
      { path: "calendar", element: <Calendar /> },
      { path: "*", element: <Navigate to="/home" />, index: true },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
