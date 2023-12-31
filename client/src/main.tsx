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
import LocationTable from "./components/table/location/locationTable.tsx";
import ResourceTable from "./components/table/resource/resourceTable.tsx";
import TablePage from "./pages/table/table.page.tsx";
import "./index.css";
import Modal from "./components/modal.tsx";
import DeleteLocationForm from "./components/table/location/forms/deleteLocationForm.tsx";
import NewLocationForm from "./components/table/location/forms/newLocationForm.tsx";
import EditLocationForm from "./components/table/location/forms/editLocationForm.tsx";
import NewResourceForm from "./components/table/resource/forms/newResourceForm.tsx";
import DeleteResourceForm from "./components/table/resource/forms/deleteResourceForm.tsx";
import { AuthProvider } from "./context/auth.provider.tsx";
import { AlertProvider } from "./context/alert.provider.tsx";
import WithAuth from "./pages/withAuth.tsx";
import {
  loaderWrapper,
  refreshServicesAndEvents,
} from "./utils/fetchWithCatch.ts";
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
  IsoToDate,
  convertFromDateToIsoString,
  toIServiceDated,
} from "./utils/dateConversion.ts";
import RescheduleForm from "./components/calendar/forms/rescheduleForm.tsx";
import { createEvent } from "./utils/calendarUtils.ts";
import CancelForm from "./components/calendar/forms/cancelForm.tsx";
import Register from "./pages/register/register.page.tsx";
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "home", element: <WithAuth children={<Home />} /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <Register /> },
      {
        path: "table",
        element: <WithAuth children={<TablePage />} />,
        // element: <TablePage />,
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <DeleteLocationForm />
                      </Modal>
                    }
                    authorityNeeded="ADMIN"
                  />
                ),
              },
              {
                path: "new",
                element: (
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <NewLocationForm />
                      </Modal>
                    }
                    authorityNeeded="ADMIN"
                  />
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <EditLocationForm />
                      </Modal>
                    }
                    authorityNeeded="ADMIN"
                  />
                ),
              },
            ],
          },
          {
            path: "resources",
            element: <WithAuth children={<ResourceTable />} />,
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <NewResourceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <DeleteResourceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <EditResourceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
                ),
              },
            ],
          },
          {
            path: "services",
            element: <WithAuth children={<ServiceTable />} />,
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <NewServiceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <EditServiceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
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
                  <WithAuth
                    children={
                      <Modal showModal={true}>
                        <DeleteServiceForm />
                      </Modal>
                    }
                    authorityNeeded="ENHANCED"
                  />
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
        element: <WithAuth children={<Calendar />} />,
        loader: async () => {
          const start = convertFromDateToIsoString(startOfMonth(new Date()));
          const end = convertFromDateToIsoString(endOfMonth(new Date()));
          const { services, serviceEventExceptions } =
            await refreshServicesAndEvents(start, end);

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
                const datedService = toIServiceDated(service as IService);
                const createdEvent = createEvent(
                  datedService,
                  IsoToDate(params.start_date!)
                );
                return createdEvent;
              }
              return event;
            },
            element: (
              <WithAuth
                children={
                  <Modal showModal={true}>
                    <RescheduleForm />
                  </Modal>
                }
                authorityNeeded="ENHANCED"
              />
            ),
          },
          {
            path: "cancel/:serviceId/:start_date",
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
                const datedService = toIServiceDated(service as IService);
                const createdEvent = createEvent(
                  datedService,
                  IsoToDate(params.start_date!)
                );
                return createdEvent;
              }
              return event;
            },
            element: (
              <WithAuth
                children={
                  <Modal showModal={true}>
                    <CancelForm />
                  </Modal>
                }
                authorityNeeded="ENHANCED"
              />
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
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
);
