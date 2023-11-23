import { Request, Response } from "express";
import {
  CreateServiceEventInput,
  ReadServiceEventInput,
  UpdateServiceEventInput,
  DeleteServiceEventInput,
  ServiceSearchServiceEventInput,
  GetEventExceptionByServiceAndStartInput,
} from "../schema/serviceEventException.schema";
import _ from "lodash";
import {
  createServiceEventException,
  updateServiceEventException,
  deleteServiceEventException,
  allServiceEventException,
  findServiceEventException,
} from "../service/serviceEventException.service";
import asyncWrapper from "../utils/asyncWrapper";
import { IServiceEventException } from "../types";

const fullEventOption = {
  lean: true,
  populate: [
    {
      path: "service",
      model: "Service",
      populate: [
        {
          path: "resource",
          model: "Resource",
          populate: { path: "location", model: "Location" },
        },
        { path: "created_by", model: "User" },
      ],
    },
    { path: "created_by", model: "User" },
  ],
};

const serviceEventController = (() => {
  //creating an exception event to be stored
  async function create(
    req: Request<{}, {}, CreateServiceEventInput["body"]>,
    res: Response
  ) {
    try {
      const body = req.body;
      // used
      const existingEvent = await findServiceEventException(
        {
          service: body.service,
          start_date: body.start_date,
        },
        fullEventOption
      );
      if (existingEvent) {
        const editedEvent = await updateServiceEventException(
          existingEvent._id,
          body,
          fullEventOption
        );
        return res.send(editedEvent);
      }

      let serviceEvent = await createServiceEventException({ body });
      await serviceEvent.populate([
        {
          path: "service",
          model: "Service",
          populate: [
            {
              path: "resource",
              model: "Resource",
              populate: { path: "location", model: "Location" },
            },
            { path: "created_by", model: "User" },
          ],
        },
        { path: "created_by", model: "User" },
      ]);
      console.log("created new event", serviceEvent);
      // TODO have a check to see if the event has been reset and can be deleted
      // - no longer rescheduled (start_date === exception_date)
      // - no longer cancelled (but also not rescheduled)
      return res.send(serviceEvent);
    } catch (error) {
      console.error(error);
      return res.send(error).sendStatus(500);
    }
  }

  async function update(
    req: Request<
      UpdateServiceEventInput["params"],
      {},
      UpdateServiceEventInput["body"]
    >,
    res: Response
  ) {
    try {
      const id = req.params.serviceEventId;
      const update = req.body;

      const foundEvent = await findServiceEventException({ _id: id });
      if (!foundEvent) {
        return res.sendStatus(404);
      }
      const updatedEvent = await updateServiceEventException(
        { _id: id },
        update,
        fullEventOption
      );
      if (updatedEvent) {
        return res.send(updatedEvent);
      }
      throw Error("DB error updating the user");
    } catch (e: any) {
      console.log(e.message);
      return res.status(409).send(e.message);
    }
  }

  async function remove(
    req: Request<DeleteServiceEventInput["params"]>,
    res: Response
  ) {
    try {
      const eventId = req.params.serviceEventId;
      const foundEvent = await findServiceEventException({ id: eventId });
      if (!foundEvent) {
        return res.sendStatus(404);
      }
      const deletedEvent = await deleteServiceEventException(
        { _id: eventId },
        fullEventOption
      );
      if (deletedEvent) {
        return res.send(deletedEvent);
      }
      throw Error("DB error deleting the user");
    } catch (e: any) {
      return res.status(409).send(e.message);
    }
  }

  const getAllInDateRange = asyncWrapper(
    async (req: Request<ReadServiceEventInput["params"]>, res: Response) => {
      const start_date = req.params.start_date;
      const end_date = req.params.end_date;

      // 1. event exceptions for services that occur during the time period (start_date within period time)(which may or may not occur themselves during the period (exception_date))
      // 2. event exceptions that occur during the time period (exception_date within period)
      const events = await allServiceEventException(
        //event exceptions that are from services which occur during the time period
        {
          $or: [
            { start_date: { $lte: end_date, $gte: start_date } },
            { exception_date: { $gte: start_date, $lte: end_date } },
          ],
        },
        fullEventOption
      );
      if (events.length === 0) {
        res.send([]);
        return;
      }
      res.send(events);
      return;
    }
  );

  async function getAllByService(
    req: Request<ServiceSearchServiceEventInput["params"]>,
    res: Response
  ) {
    const serviceId = req.params.serviceId;
    const foundEvents = await allServiceEventException(
      { service: serviceId },
      fullEventOption
    );
    if (foundEvents.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(foundEvents);
  }

  async function getByStartDateAndService(
    req: Request<GetEventExceptionByServiceAndStartInput["params"]>,
    res: Response
  ) {
    const serviceId = req.params.serviceId;
    const startDate = req.params.start_date;
    try {
      const foundEventException = await findServiceEventException(
        { service: serviceId, start_date: startDate },
        fullEventOption
      );

      if (!foundEventException) {
        return res.sendStatus(204);
      }
      return res.send(foundEventException);
    } catch (e: any) {
      console.log(e.message);
      return res.status(409).send(e.message);
    }
  }

  return {
    create,
    update,
    remove,
    getAllInDateRange,
    getAllByService,
    getByStartDateAndService,
  };
})();
export default serviceEventController;
