import { Request, Response } from "express";
import {
  CreateLocationInput,
  UpdateLocationInput,
  DeleteLocationInput,
  ReadLocationInput,
} from "../schema/location.schema";
import {
  createLocation,
  findLocation,
  deleteLocation,
  updateLocation,
  allLocations,
} from "../service/location.service";

const locationController = (() => {
  async function all(req: Request, res: Response) {
    const locations = await allLocations();

    if (locations.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(locations);
  }
  async function create(
    req: Request<{}, {}, CreateLocationInput["body"]>,
    res: Response
  ) {
    const body = req.body;
    const location = await createLocation({ body });
    return res.send(location);
  }
  async function remove(
    req: Request<DeleteLocationInput["params"]>,
    res: Response
  ) {
    const id = req.params.locationId;
    const location = await findLocation({ id });
    if (!location) {
      return res.sendStatus(404);
    }
    const removedLocation = await deleteLocation({ _id: id });
    return res.send(removedLocation);
  }
  async function edit(
    req: Request<
      UpdateLocationInput["params"],
      {},
      UpdateLocationInput["body"]
    >,
    res: Response
  ) {
    const id = req.params.locationId;
    const update = req.body;

    const location = await findLocation({ id });
    if (!location) {
      return res.sendStatus(404);
    }

    const updatedLocation = await updateLocation({ _id: id }, update, {
      new: true,
      lean: true,
    });
    return res.send(updatedLocation);
  }
  async function get(req: Request<ReadLocationInput["params"]>, res: Response) {
    const id = req.params.locationId;

    const location = await findLocation({ id });
    if (!location) {
      return res.sendStatus(404);
    }
    return res.send(location);
  }

  return { all, create, remove, edit, get };
})();
export default locationController;
