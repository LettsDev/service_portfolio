import { Request, Response } from "express";
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
  queryResources,
} from "../service/resource.service";

const resourceController = (() => {
  async function all(req: Request, res: Response) {
    const resources = await allResource();

    if (resources.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(resources);
  }

  async function create(
    req: Request<{}, {}, CreateResourceInput["body"]>,
    res: Response
  ) {
    const body = req.body;

    const resource = await createResource({ body });
    return res.send(resource);
  }

  async function remove(
    req: Request<DeleteResourceInput["params"]>,
    res: Response
  ) {
    const id = req.params.resourceId;
    const resource = await findResource({ id });

    if (!resource) {
      return res.sendStatus(404);
    }

    const deletedResource = await deleteResource({ _id: id });
    return res.send(deletedResource);
  }

  async function edit(
    req: Request<
      UpdateResourceInput["params"],
      {},
      UpdateResourceInput["body"]
    >,
    res: Response
  ) {
    const id = req.params.resourceId;
    const update = req.body;

    const resource = await findResource({ id });

    if (!resource) {
      return res.sendStatus(404);
    }

    const updatedResource = await updateResource({ _id: id }, update, {
      new: true,
      lean: true,
    });

    return res.send(updatedResource);
  }

  async function get(req: Request<ReadResourceInput["params"]>, res: Response) {
    const id = req.params.resourceId;
    const resource = await findResource({ id });
    if (!resource) {
      return res.sendStatus(404);
    }

    return res.send(resource);
  }

  async function queryByLocation(
    req: Request<QueryByLocationInput["params"]>,
    res: Response
  ) {
    //need to query by location
    const id = req.params.locationId;
    const resources = await queryResources({ location: id });
    if (!resources) {
      return res.sendStatus(404);
    }

    return res.send(resources);
  }

  return { all, create, remove, edit, get, queryByLocation };
})();

export default resourceController;
