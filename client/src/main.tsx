import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App.tsx";
import LoginPage from "./pages/login/login.page.tsx";
import ErrorPage from "./pages/error.tsx";
import Home from "./pages/home/home.page.tsx";
import Calendar from "./pages/calendar/calendar.page.tsx";
import TablePage from "./pages/table/table.page.tsx";
import LocationTable from "./components/table/location/locationTable.tsx";
import ResourceTable from "./components/table/resource/resourceTable.tsx";
import "./index.css";
import Modal from "./components/modal.tsx";
import axios from "axios";
import DeleteLocationForm from "./components/table/location/forms/deleteLocationForm.tsx";
import NewLocationForm from "./components/table/location/forms/newLocationForm.tsx";
import EditLocationForm from "./components/table/location/forms/editLocationForm.tsx";
import NewResourceForm from "./components/table/resource/forms/newResourceForm.tsx";
import DeleteResourceForm from "./components/table/resource/forms/deleteResourceForm.tsx";
import { AuthProvider } from "./context/auth.provider.tsx";
import WithAuth from "./pages/withAuth.tsx";
import { loaderWrapper } from "./utils/fetchWithCatch.ts";
import EditResourceForm from "./components/table/resource/forms/editResourceForm.tsx";
import {
  ILocation,
  IResource,
  IService,
  IServiceEventException,
} from "./types.ts";
import ServiceTable from "./components/table/service/serviceTable.tsx";
import NewServiceForm from "./components/table/service/forms/newServiceForm.tsx";
import DeleteServiceForm from "./components/table/service/forms/deleteServiceForm.tsx";
import EditServiceForm from "./components/table/service/forms/editServiceForm.tsx";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  convertFromDateToIsoString,
  toIServiceDated,
} from "./utils/dateConversion.ts";
import RescheduleForm from "./components/calendar/forms/rescheduleForm.tsx";
import { createEvent } from "./utils/calendarUtils.ts";
const router = createBrowserRouter([
  {
    element: <App />,
    loader: async () =>
      axios.post("/api/session", {
        email: "test@gmail.com",
        password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
      }),
    children: [
      { path: "home", element: <WithAuth children={<Home />} /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "table",
        element: <WithAuth children={<TablePage />} />,
        children: [
          {
            path: "locations",
            element: <WithAuth children={<LocationTable />} />,
            loader: async () => {
              return loaderWrapper({ url: "location", method: "get" });
            },
            children: [
              {
                path: "delete/:id",
                loader: async ({ params }) => {
                  return loaderWrapper({
                    url: `location/${params.id}`,
                    method: "get",
                  });
                },
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
                loader: async ({ params }) => {
                  return loaderWrapper({
                    url: `location/${params.id}`,
                    method: "get",
                  });
                },
                element: (
                  <Modal showModal={true}>
                    <EditLocationForm />
                  </Modal>
                ),
              },
            ],
          },
          {
            path: "resources",
            element: <ResourceTable />,
            loader: async () => {
              return loaderWrapper({
                url: "resource",
                method: "get",
              });
            },
            children: [
              {
                path: "new",
                loader: async () => {
                  return loaderWrapper({ url: "location", method: "get" });
                },

                element: (
                  <Modal showModal={true}>
                    <NewResourceForm />
                  </Modal>
                ),
              },
              {
                path: `delete/:id`,
                loader: async ({ params }) => {
                  return loaderWrapper({
                    url: `resource/${params.id}`,
                    method: "get",
                  });
                },
                element: (
                  <Modal showModal={true}>
                    <DeleteResourceForm />
                  </Modal>
                ),
              },
              {
                path: "edit/:id",
                loader: async ({ params }) => {
                  const locations = await loaderWrapper<ILocation[]>({
                    url: "location",
                    method: "get",
                  });
                  const resource = await loaderWrapper<IResource>({
                    url: `resource/${params.id}`,
                    method: "get",
                  });
                  return { locations, resource };
                },
                element: (
                  <Modal showModal={true}>
                    <EditResourceForm />
                  </Modal>
                ),
              },
            ],
          },
          {
            path: "services",
            element: <ServiceTable />,
            loader: async () => {
              return loaderWrapper<IService[]>({
                url: "service",
                method: "get",
              });
            },
            children: [
              {
                path: "new",
                element: (
                  <Modal showModal={true}>
                    <NewServiceForm />
                  </Modal>
                ),
                loader: async () => {
                  return loaderWrapper<IResource[]>({
                    url: "resource",
                    method: "get",
                  });
                },
              },
              {
                path: "edit/:id",
                element: (
                  <Modal showModal={true}>
                    <EditServiceForm />
                  </Modal>
                ),
                loader: async ({ params }) => {
                  const resources = await loaderWrapper<IResource[]>({
                    url: "resource",
                    method: "get",
                  });
                  const service = await loaderWrapper<IService>({
                    url: `service/${params.id}`,
                    method: "get",
                  });
                  return { resources, service };
                },
              },
              {
                path: "delete/:id",
                element: (
                  <Modal showModal={true}>
                    <DeleteServiceForm />
                  </Modal>
                ),
                loader: async ({ params }) => {
                  return loaderWrapper<IService>({
                    url: `service/${params.id}`,
                    method: "get",
                  });
                },
              },
            ],
          },
        ],
      },
      {
        path: "calendar",
        element: <Calendar />,
        loader: async () => {
          const start = convertFromDateToIsoString(startOfMonth(new Date()));
          const end = convertFromDateToIsoString(endOfMonth(new Date()));
          const services = await loaderWrapper<IService[]>({
            url: `service/${start}/${end}`,
            method: "get",
          });
          const serviceEventExceptions = await loaderWrapper<
            IServiceEventException[]
          >({ url: `serviceEvent/${start}/${end}`, method: "get" });
          return {
            initialServices: services,
            initialEventExceptions: serviceEventExceptions,
          };
        },
        children: [
          {
            path: "reschedule/:serviceId/:start_date",
            loader: async ({ params }) => {
              const event = await loaderWrapper<
                IServiceEventException | undefined
              >({
                url: `serviceEvent/search/${params.serviceId}/${params.start_date}`,
                method: "get",
              });
              if (!event) {
                const service = await loaderWrapper<IService>({
                  url: `service/${params.serviceId}`,
                  method: "get",
                });
                if (!service) {
                  throw Error("could not find service");
                }
                const createdEvent = createEvent(
                  service as IService,
                  new Date(params.start_date!)
                );
                return createdEvent;
              }
              return event;
            },
            element: (
              <Modal showModal={true}>
                <RescheduleForm />
              </Modal>
            ),
          },
        ],
      },
      { path: "*", element: <Navigate to="/home" />, index: true },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
