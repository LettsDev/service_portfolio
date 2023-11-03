import { Request, Response } from "express";
import {
  CreateServiceEventInput,
  ReadServiceEventInput,
  UpdateServiceEventInput,
  DeleteServiceEventInput,
  ServiceSearchServiceEventInput,
} from "../schema/serviceEventException.schema";

import {
  createServiceEventException,
  updateServiceEventException,
  deleteServiceEventException,
  allServiceEventException,
  findServiceEventException,
} from "../service/serviceEventException.service";
import asyncWrapper from "../utils/asyncWrapper";

const serviceEventController = (() => {
  //creating an exception event to be stored
  async function create(
    req: Request<{}, {}, CreateServiceEventInput["body"]>,
    res: Response
  ) {
    const serviceEvent = await createServiceEventException(req);
    return res.send(serviceEvent);
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
        {
          lean: true,
          new: true,
          populate: [
            { path: "service", model: "Service" },
            { path: "created_by", model: "User" },
          ],
        }
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
        {
          lean: true,
          populate: [
            { path: "service", model: "Service" },
            { path: "created_by", model: "User" },
          ],
        }
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
      const eventsBasedOnServices = await allServiceEventException(
        //event exceptions that are from services which occur during the time period
        {
          start_date: { $lte: end_date, $gte: start_date },
        },
        {
          lean: true,
          populate: [
            { path: "service", model: "Service" },
            { path: "created_by", model: "User" },
          ],
        }
      );

      const eventsBasedOnDateRange = await allServiceEventException(
        // These are event exceptions that occur during the time period
        { exception_date: { $gte: start_date, $lte: end_date } },
        {
          lean: true,
          populate: [
            { path: "service", model: "Service" },
            { path: "created_by", model: "User" },
          ],
        }
      );
      const arr = [...eventsBasedOnServices, ...eventsBasedOnDateRange];
      // remove duplicates
      const mergedArr = [...new Set(arr)];
      if (mergedArr.length === 0) {
        res.send([]);
        return;
      }
      res.send(mergedArr);
    }
  );

  async function getAllByService(
    req: Request<ServiceSearchServiceEventInput["params"]>,
    res: Response
  ) {
    const serviceId = req.params.serviceId;
    const foundEvents = await allServiceEventException(
      { service: serviceId },
      {
        lean: true,
        populate: [
          { path: "service", model: "Service" },
          { path: "created_by", model: "User" },
        ],
      }
    );
    if (foundEvents.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(foundEvents);
  }

  return { create, update, remove, getAllInDateRange, getAllByService };
})();
export default serviceEventController;
