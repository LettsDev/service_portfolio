import { CreateServiceInput } from "../schema/service.schema";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Service from "../models/serviceModel";
import { ExtendedError, IService } from "../types";

export async function createService(input: CreateServiceInput) {
  return Service.create(input.body);
}

export async function findService(
  query: FilterQuery<IService>,
  options: QueryOptions = { lean: true }
) {
  return Service.findById(query.id, {}, options)
    .populate({ path: "resource", populate: { path: "location" } })
    .populate("created_by")
    .exec();
}

export async function updateService(
  query: FilterQuery<IService>,
  update: UpdateQuery<IService>,
  options: QueryOptions = { lean: true, new: true }
) {
  return Service.findByIdAndUpdate(query, update, options)
    .populate({ path: "resource", populate: { path: "location" } })
    .populate("created_by")
    .exec();
}

export async function deleteService(
  query: FilterQuery<IService>,
  options: QueryOptions = { lean: true }
) {
  const service = await Service.findOne(query);
  if (!service) {
    throw new ExtendedError("No service found", 404);
  }
  service.deleteOne();
  return service;
}

export async function allServices(
  query: FilterQuery<IService> = {},
  options: QueryOptions = { lean: true }
) {
  return Service.find(query, {}, options)
    .populate({ path: "resource", populate: { path: "location" } })
    .populate("created_by")
    .exec();
}

export async function queryByResourceServices(
  query: FilterQuery<Pick<IService, "resource">>,
  options: QueryOptions = { lean: true }
) {
  return Service.find(query, {}, options)
    .populate("resource")
    .populate("created_by")
    .exec();
}
