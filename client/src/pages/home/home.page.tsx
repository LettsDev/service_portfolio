import {
  MidHeader,
  LowHeader,
  CodeBlock,
} from "../../components/home/headers/homeElements";
import uiUrl from "../../assets/ui_overview.png";
import tableUrl from "../../assets/tables.png";
import calendarUrl from "../../assets/calendar.png";
import detailUrl from "../../assets/model_detail.png";
import flowUrl from "../../assets/model_flow.png";
export default function Home() {
  return (
    <div className="p-4 lg:flex lg:flex-col lg:items-center mb-8">
      <header>
        <h1 className="text-3xl font-bold mb-3">Documentation</h1>
      </header>
      <nav className="lg:w-xl">
        <ul className="text-sx md:text-sm flex flex-col gap-2">
          <li>
            <a className="underline" href="#introduction">
              Introduction
            </a>
            <ul className=" flex flex-col gap-1 pl-2 pt-1">
              <li>
                <a className="underline" href="#resource_management">
                  Resource Management
                </a>
              </li>
              <li>
                <a className="underline" href="#location_assignment">
                  Location Assignment
                </a>
              </li>
              <li>
                <a className="underline" href="#service_attachment">
                  Service Attachment
                </a>
              </li>
              <li>
                <a className="underline" href="#scheduling">
                  Scheduling and Event Creation
                </a>
              </li>
              <li>
                <a className="underline" href="#auth">
                  Authentication and Authorization
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a className="underline" href="#start">
              Getting Started
            </a>
          </li>
          <li>
            <a className="underline" href="#user_guide">
              User Guide
            </a>
            <ul className="flex flex-col gap-1 pl-2 pt-1">
              <li>
                <a className="underline" href="#user_creation">
                  User Creation
                </a>
              </li>
              <li>
                <a className="underline" href="#add_info">
                  Adding information
                </a>
              </li>
              <li>
                <a className="underline" href="#overview">
                  Overview
                </a>
              </li>
              <li>
                <a className="underline" href="#tables">
                  Tables
                </a>
              </li>
              <li>
                <a className="underline" href="#calendar">
                  Calendar
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a className="underline" href="#models">
              Data Models
            </a>
          </li>
          <li>
            <a className="underline" href="#overview">
              Project Overview
            </a>
          </li>
          <li>
            <a className="underline" href="#tech">
              Technologies Used
            </a>
          </li>
          <li>
            <a className="underline" href="#config">
              Configuration
            </a>
          </li>
          <li>
            <a className="underline" href="#challenge">
              Challenges and Solutions
            </a>
          </li>
          <li>
            <a className="underline" href="#future">
              Possible Future Enhancements
            </a>
          </li>
          <li>
            <a className="underline" href="#conclusion">
              Conclusion
            </a>
          </li>
        </ul>
      </nav>
      <main className="max-w-xl">
        <section id="introduction">
          <MidHeader text="Introduction" />
          <p className="pb-2 indent-1">
            Previously I held a position with an airline that operated equipment
            at various airports across Canada. A significant challenge the
            company encountered involved effectively overseeing the services
            provided for the equipment and maintaining a comprehensive record of
            all maintenance activities across their fleet.
          </p>
          <p className="pb-2 indent-1">
            This App is a resource management and scheduling tool that
            simplifies the process of keeping track of resources, their assigned
            locations, and the services that they require. The automated event
            creation system enhances the user experience by ensuring timely
            attention to maintenance tasks.
          </p>
          <p className="pb-2 indent-1">
            A break down of the functionality includes:
          </p>
          <section id="resource_management">
            <LowHeader text="Resource Management" />
            <p className="pb-2 indent-1">
              The app allows users to manage various resources, such as trucks,
              equipment or any items that require maintenance or service.
            </p>
          </section>
          <section id="location_assignment">
            <LowHeader text="Location Assignment" />
            <p className="pb-2 indent-1">
              Users can assign these resources to specific locations. This
              allows the resources to be tied to physical locations in the real
              world.
            </p>
          </section>
          <section id="service_attachment">
            <LowHeader text="Service Attachment" />
            <p className="pb-2 indent-1">
              Each resource can be assigned with one or more service. These
              services represent tasks or maintenance activities that need to be
              performed on the resource.
            </p>
          </section>
          <section id="scheduling">
            <LowHeader text="Scheduling and Event Creation" />
            <p className="pb-2 indent-1">
              Based on the schedules, the app automatically generates events.
              These events serve as reminders or notifications to inform users
              that it’s time to perform a particular task or service on the
              resource.
            </p>
          </section>
          <section id="auth">
            <LowHeader text="Authentication and Authorization" />
            <p className="pb-2 indent-1">
              Depending on the role of the user, they will have different
              permissions as to read/write capabilities.
            </p>
          </section>
        </section>
        <section id="start">
          <MidHeader text="Getting Started" />
          <p className="pb-2 indent-1">To start a preview dev server:</p>
          <ol className="list-decimal list-inside">
            <li>
              fork from{" "}
              <a
                className="underline"
                href="https://github.com/LettsDev/service_portfolio"
              >
                this
              </a>{" "}
              repository
            </li>
            <li>
              Add .env{" "}
              <a className="underline" href="#config">
                configuration file
              </a>
            </li>
            <li>open terminal in the /server directory</li>
            <li>run the following command</li>
            <CodeBlock text="npm run dev" />
            <p className="py-2 indent-1 ">
              Use Node.js version v20.6.1 or higher.
            </p>
          </ol>
        </section>
        <section id="user_guide">
          <MidHeader text="User Guide" />
          <section id="user_creation">
            <LowHeader text="User Creation" />
            <p className="pb-2 indent-1">
              When creating a new user (register new user) you have 3 choices as
              to the authority level of the user (Admin, Enhanced, User). They
              will directly impact which functions are available. Below is a
              table outlining the minimum authority levels required for each
              function:
            </p>
            <table className="table table-zebra table-sm max-w-xl">
              <thead>
                <tr>
                  <td>Action</td>
                  <td>Auth Level</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>View any information</td>
                  <td>User</td>
                </tr>
                <tr>
                  <td>Location (add, edit, remove)</td>
                  <td>Admin</td>
                </tr>
                <tr>
                  <td>Resource (add, edit, remove)</td>
                  <td>Enhanced (if creator, otherwise Admin)</td>
                </tr>
                <tr>
                  <td>Service (add, edit, remove)</td>
                  <td>Enhanced (if creator, otherwise Admin)</td>
                </tr>
                <tr>
                  <td>Service Event Exception (reschedule, cancel)</td>
                  <td>Enhanced (if creator, otherwise Admin)</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section id="add_info">
            <LowHeader text="Adding information" />
            <p className="pb-2 indent-1">
              In order to fully create an instance of a resource with a service
              attached:
            </p>
            <ol className="list-decimal list-inside">
              <li>create a location</li>
              <li>
                create the resource and assign to the location on initialization
              </li>
              <li>create services that can be attached to the resource</li>
            </ol>
            <p className="pb-2 indent-1">
              All this happens within the Tables section. The add, edit and
              delete buttons all lead to modal forms for data entry.
            </p>
            <p className="pb-2 indent-1">
              After a service has been created, events will be generated and
              displayed on the calendar. On selection of a day in the calendar
              which contains an event, more information will be displayed about
              the event. The user is able to reschedule or cancel the selected
              event.
            </p>
          </section>
          <section id="overview">
            <LowHeader text="Overview" />
            <img
              className="max-w-xl w-5/6"
              src={uiUrl}
              alt="overview of the app"
            />
          </section>
          <section id="tables">
            <LowHeader text="Tables" />
            <img
              className="max-w-xl w-5/6"
              src={tableUrl}
              alt="overview tables"
            />
          </section>
          <section id="calendar">
            <LowHeader text="Calendar" />
            <img
              className="max-w-xl w-5/6"
              src={calendarUrl}
              alt="overview of the calendar"
            />
          </section>
        </section>
        <section id="models">
          <MidHeader text="Data Models" />
          <img className="max-w-xl w-5/6" src={flowUrl} alt="model flow" />
          <img
            className="max-w-xl w-5/6"
            src={detailUrl}
            alt="detailed look at the models"
          />
        </section>
        <section id="overview">
          <MidHeader text="Project Overview" />
          <p className="pb-2 indent-1">
            The app was designed to encompass many of the features that a
            production app would require. They include:
          </p>
          <ul className="list-disc list-inside sm:space-y-2">
            <li> authentication using JSON web tokens (cookie based auth) </li>
            <li> API routes which are locked based on user authority </li>
            <li> validation and sanitization of API requests </li>
            <li> CORS, helmet and other security practices </li>
            <li>
              a responsive UI that would be functional both on a phone and
              desktop
            </li>
          </ul>
        </section>
        <section id="tech">
          <MidHeader text="Technologies Used" />
          <table className="table table-zebra table-sm max-w-xl ">
            <thead>
              <tr>
                <td>Frontend</td>
                <td>Backend</td>
                <td>Both</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ReactJS</td>
                <td> express</td>
                <td>TypeScript</td>
              </tr>
              <tr>
                <td>Vite</td>
                <td> bcryptjs</td>
                <td>Zod</td>
              </tr>
              <tr>
                <td>vitest</td>
                <td> mongoose</td>
                <td>date-fns</td>
              </tr>
              <tr>
                <td>react-hook-form</td>
                <td> morgan</td>
              </tr>
              <tr>
                <td>react-router</td>
                <td> lodash</td>
              </tr>
              <tr>
                <td>axios</td>
                <td> jsonwebtoken</td>
              </tr>
              <tr>
                <td>TailwindCSS</td>
              </tr>
              <tr>
                <td>daisyUI</td>
              </tr>
              <tr>
                <td>react-icons</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="config">
          <MidHeader text="Configuration" />
          <p className="pb-2 indent-1">
            Within the server directory a <CodeBlock text=".env" /> file is
            required. It should{" "}
            <a
              className="underline"
              href="https://github.com/LettsDev/service_portfolio/blob/main/README.md/#configuration"
            >
              contain the following
            </a>
            .
          </p>
        </section>
        <section id="challenge">
          <MidHeader text="Challenges and Solutions" />
          <ul className="list-disc list-inside">
            <li>
              Typescript isn’t fully supported by some of the modules used, and
              so some workarounds were necessary (using “as” to type variables)
            </li>
            <li>
              working with scheduling was tricky as there were many things to
              take account of (working with different time-zones, leap-years)
            </li>
            <li>
              not being able to use the full assortment of HTML time pickers
              (month, year) as they did not have satisfactory browser support
            </li>
            <li>
              being able to accommodate a dynamic set of inputs that worked with
              react-hook-form (schedule creation)
            </li>
          </ul>
        </section>
        <section id="future">
          <MidHeader text="Possible Future Enhancements" />
          <ul className="list-disc list-inside">
            <li>
              attach notes to services and service exception events would
              provide more needed information. For example if a particular
              vendor was used for a service or the employee who completed the
              service event
            </li>
            <li>
              adding in a status field to resources to indicate their usability
            </li>
            <li>
              including geographical-coordinates to the location model in order
              to display a map of locations & resources
            </li>
            <li>
              admins having more control over the adding, editing and removal of
              users
            </li>
            <li>
              users can be assigned locations where additional authority
              parameters can be added. For example only users at a certain
              location can make changes to model data if at a certain authority
              level
            </li>
          </ul>
        </section>
        <section id="conclusion">
          <MidHeader text="Conclusion" />
          <p className="pb-2 indent-1">
            In conclusion, this application serves as an effective tool for
            managing resources and scheduling services in an organized manner.
            It offers a comprehensive solution for keeping track of resources,
            assigning them to physical locations, and scheduling maintenance
            tasks.
          </p>
        </section>
      </main>
    </div>
  );
}
