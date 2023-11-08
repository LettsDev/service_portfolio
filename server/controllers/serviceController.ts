import { Request, Response } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import { ExtendedError } from "../types";
import {
  CreateServiceInput,
  UpdateServiceInput,
  DeleteServiceInput,
  ReadServiceInput,
  AllServiceInput,
  QueryByResourceInput,
} from "../schema/service.schema";
import {
  createService,
  findService,
  deleteService,
  updateService,
  allServices,
  queryByResourceServices,
} from "../service/service.service";

const serviceController = (() => {
  const queryByDate = asyncWrapper(
    async (req: Request<AllServiceInput["params"]>, res: Response) => {
      const startDate = req.params.start_date;
      const endDate = req.params.end_date;
      const formattedStart = new Date(startDate).toISOString();
      const formattedEnd = new Date(endDate).toISOString();
      const services = await allServices({
        start_date: { $lte: formattedEnd },
        completion_date: { $gte: formattedStart },
      });
      console.log("services: ", services);
      if (services.length === 0) {
        res.send([]);
        return;
      }

      res.send(services);
    }
  );

  const create = asyncWrapper(
    async (req: Request<{}, {}, CreateServiceInput["body"]>, res: Response) => {
      const body = req.body;
      const service = await createService({ body });
      res.send(service);
    }
  );

  const remove = asyncWrapper(
    async (req: Request<DeleteServiceInput["params"]>, res: Response) => {
      const id = req.params.serviceId;
      const service = await findService({ id });

      if (!service) {
        throw new ExtendedError("Service not found", 404);
      }

      const removedService = await deleteService({ _id: id });
      res.send(removedService);
    }
  );

  const edit = asyncWrapper(
    async (
      req: Request<
        UpdateServiceInput["params"],
        {},
        UpdateServiceInput["body"]
      >,
      res: Response
    ) => {
      const id = req.params.serviceId;
      const update = req.body;
      const service = await findService({ id });

      if (!service) {
        throw new ExtendedError("Service not found", 404);
      }
      // IF you edit the schedule then all Event Exceptions would have to be changed as well... So better to delete them on edit and delete of service
      const updatedService = await updateService({ _id: id }, update, {
        new: true,
        lean: true,
      });
      res.send(updatedService);
    }
  );

  const get = asyncWrapper(
    async (req: Request<ReadServiceInput["params"]>, res: Response) => {
      const id = req.params.serviceId;
      const service = await findService({ id });

      if (!service) {
        throw new ExtendedError("Service not found", 404);
      }

      res.send(service);
    }
  );

  const queryByResource = asyncWrapper(
    async (req: Request<QueryByResourceInput["params"]>, res: Response) => {
      const id = req.params.resourceId;
      const services = await queryByResourceServices({ resource: id });

      if (!services) {
        throw new ExtendedError("No services found for the resource", 404);
      }

      res.send(services);
    }
  );

  const all = asyncWrapper(async (req: Request, res: Response) => {
    const services = await allServices();
    if (services.length === 0) {
      res.send([]);
      return;
    }
    console.log(services);
    res.send(services);
  });

  return { queryByDate, create, remove, edit, get, queryByResource, all };
})();
export default serviceController;
