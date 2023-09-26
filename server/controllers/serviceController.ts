import { Request, Response } from "express";
import {
  CreateServiceInput,
  UpdateServiceInput,
  DeleteServiceInput,
  ReadServiceInput,
  AllServiceInput,
} from "../schema/service.schema";
import {
  createService,
  findService,
  deleteService,
  updateService,
  allServices,
} from "../service/service.service";

const serviceController = (() => {
  async function all(req: Request<AllServiceInput["params"]>, res: Response) {
    const startDate = req.params.start_date;
    const endDate = req.params.end_date;
    // filter the services that start on or after the startDate and before or on the endDate
    const services = await allServices({
      start_date: { $gte: startDate },
      completion_date: { $lte: endDate },
    });
    if (services.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(services);
  }

  async function create(
    req: Request<{}, {}, CreateServiceInput["body"]>,
    res: Response
  ) {
    const body = req.body;
    const service = await createService({ body });
    return res.send(service);
  }

  async function remove(
    req: Request<DeleteServiceInput["params"]>,
    res: Response
  ) {
    const id = req.params.serviceId;
    const service = await findService({ id });
    if (!service) {
      return res.sendStatus(404);
    }
    const removedService = await deleteService({ _id: id });
    return res.send(removedService);
  }

  async function edit(
    req: Request<UpdateServiceInput["params"], {}, UpdateServiceInput["body"]>,
    res: Response
  ) {
    const id = req.params.serviceId;
    const update = req.body;
    const service = await findService({ id });
    if (!service) {
      return res.sendStatus(404);
    }
    const updatedService = await updateService({ _id: id }, update, {
      new: true,
      lean: true,
    });
    return res.send(updatedService);
  }

  async function get(req: Request<ReadServiceInput["params"]>, res: Response) {
    const id = req.params.serviceId;
    const service = await findService({ id });
    if (!service) {
      return res.sendStatus(404);
    }
    return res.send(service);
  }

  return { all, create, remove, edit, get };
})();
export default serviceController;
