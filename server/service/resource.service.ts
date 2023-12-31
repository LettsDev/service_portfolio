import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { CreateResourceInput } from "../schema/resource.schema";
import Resource from "../models/resourceModel";
import { ExtendedError, IResource } from "../types";

export async function createResource(input: CreateResourceInput) {
  return Resource.create(input.body);
}

export async function findResource(
  query: FilterQuery<IResource>,
  options: QueryOptions = { lean: true }
) {
  return Resource.findById(query.id, {}, options)
    .populate("location")
    .populate("created_by")
    .populate("numServices")
    .exec();
}

export async function updateResource(
  query: FilterQuery<IResource>,
  update: UpdateQuery<IResource>,
  options: QueryOptions = { lean: true, new: true }
) {
  return Resource.findByIdAndUpdate(query, update, options)
    .populate("location")
    .populate("created_by")
    .populate("numServices")
    .exec();
}

export async function deleteResource(
  query: FilterQuery<IResource>,
  options: QueryOptions = { lean: true }
) {
  const resource = await Resource.findOne(query)
    .populate("location")
    .populate("created_by")
    .populate("numServices")
    .exec();
  if (!resource) {
    throw new ExtendedError("No resource found", 404);
  }
  resource.deleteOne();
  return resource;
}

export async function allResources(options: QueryOptions = { lean: true }) {
  return Resource.find({}, {}, options)
    .populate("numServices")
    .populate("location")
    .populate("created_by")
    .exec();
}

export async function queryByLocationResources(
  query: FilterQuery<Pick<IResource, "location">>,
  options: QueryOptions = { lean: true }
) {
  return Resource.find(query, {}, options)
    .populate("location")
    .populate("created_by")
    .populate("numServices")
    .exec();
}
