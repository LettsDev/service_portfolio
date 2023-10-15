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
import {
  deleteResource,
  queryByLocationResources,
} from "../service/resource.service";
import { ExtendedError } from "../types";
import asyncWrapper from "../utils/asyncWrapper";
const locationController = (() => {
  const all = asyncWrapper(async (req: Request, res: Response) => {
    const locations = await allLocations();
    if (locations.length === 0) {
      res.send([]);
      return;
    }
    res.send(locations);
  });

  const create = asyncWrapper(
    async (
      req: Request<{}, {}, CreateLocationInput["body"]>,
      res: Response
    ) => {
      const body = req.body;
      const location = await createLocation({ body });
      res.send(location);
    }
  );
  // remove location and the associated resources and services
  const remove = asyncWrapper(
    async (req: Request<DeleteLocationInput["params"]>, res: Response) => {
      const id = req.params.locationId;
      const location = await findLocation({ id });
      if (!location) {
        throw new ExtendedError("cannot find location", 404);
      }

      // need to delete the resources first else the location id will be null on the resources
      const foundResources = await queryByLocationResources({ location: id });
      if (foundResources.length > 0) {
        foundResources.forEach(async (resource) => {
          await deleteResource({ _id: resource._id });
        });
      }
      //TODO need to delete the services that are attached to the resources
      const removedLocation = await deleteLocation({ _id: id });
      res.send(removedLocation);
    }
  );

  const edit = asyncWrapper(
    async (
      req: Request<
        UpdateLocationInput["params"],
        {},
        UpdateLocationInput["body"]
      >,
      res: Response
    ) => {
      const id = req.params.locationId;
      const update = req.body;

      const location = await findLocation({ id });
      if (!location) {
        throw new ExtendedError("cannot find location", 404);
      }

      const updatedLocation = await updateLocation({ _id: id }, update, {
        new: true,
        lean: true,
      });
      res.send(updatedLocation);
    }
  );

  const get = asyncWrapper(
    async (req: Request<ReadLocationInput["params"]>, res: Response) => {
      const id = req.params.locationId;

      const location = await findLocation({ id });
      if (!location) {
        throw new ExtendedError("couldn't find location", 404);
      }
      res.send(location);
    }
  );

  return { all, create, remove, edit, get };
})();
export default locationController;
