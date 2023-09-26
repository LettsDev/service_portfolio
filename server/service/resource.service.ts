import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { CreateResourceInput } from "../schema/resource.schema";
import Resource from "../models/resourceModel";
import { IResource } from "../types";

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
    .exec();
}

export async function deleteResource(
  query: FilterQuery<IResource>,
  options: QueryOptions = { lean: true }
) {
  return Resource.findByIdAndRemove(query, options)
    .populate("location")
    .populate("created_by")
    .exec();
}

export async function allResource(options: QueryOptions = { lean: true }) {
  return Resource.find({}, {}, options)
    .populate("location")
    .populate("created_by")
    .exec();
}
