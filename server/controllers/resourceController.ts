import { Request, Response } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import { ExtendedError } from "../types";
import {
  CreateResourceInput,
  DeleteResourceInput,
  UpdateResourceInput,
  ReadResourceInput,
  QueryByLocationInput,
} from "../schema/resource.schema";
import {
  createResource,
  findResource,
  updateResource,
  deleteResource,
  allResource,
  queryByLocationResources,
} from "../service/resource.service";

const resourceController = (() => {
  const all = asyncWrapper(async (req: Request, res: Response) => {
    const resources = await allResource({
      populate: [
        { path: "location", model: "Location" },
        { path: "created_by", model: "User" },
      ],
    });
    if (resources.length === 0) {
      res.send([]);
      return;
    }

    res.send(resources);
  });

  const create = asyncWrapper(
    async (
      req: Request<{}, {}, CreateResourceInput["body"]>,
      res: Response
    ) => {
      const body = req.body;

      const resource = await createResource({ body });
      await resource.populate("created_by");
      await resource.populate("location");
      await resource.populate("numServices");
      console.log(resource);
      res.send(resource);
    }
  );

  const remove = asyncWrapper(
    async (
      req: Request<DeleteResourceInput["params"], {}, {}>,
      res: Response
    ) => {
      const id = req.params.resourceId;
      const deletedResource = await deleteResource({ _id: id });
      res.send(deletedResource);
    }
  );

  const edit = asyncWrapper(
    async (
      req: Request<
        UpdateResourceInput["params"],
        {},
        UpdateResourceInput["body"]
      >,
      res: Response
    ) => {
      const id = req.params.resourceId;
      const update = req.body;

      const resource = await findResource({ id });

      if (!resource) {
        throw new ExtendedError("No resource found", 404);
      }

      const updatedResource = await updateResource({ _id: id }, update, {
        new: true,
        lean: true,
      });

      res.send(updatedResource);
    }
  );

  const get = asyncWrapper(
    async (
      req: Request<ReadResourceInput["params"], {}, {}>,
      res: Response
    ) => {
      const id = req.params.resourceId;
      const resource = await findResource({ id });

      if (!resource) {
        throw new ExtendedError("No resource found", 404);
      }

      res.send(resource);
    }
  );

  const queryByLocation = asyncWrapper(
    async (
      req: Request<QueryByLocationInput["params"], {}, {}>,
      res: Response
    ) => {
      const id = req.params.locationId;
      const resources = await queryByLocationResources({ location: id });

      if (resources.length === 0) {
        res.send([]);
        return;
      }

      res.send(resources);
    }
  );

  return { all, create, remove, edit, get, queryByLocation };
})();

export default resourceController;
