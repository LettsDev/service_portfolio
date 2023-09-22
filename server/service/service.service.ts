import { CreateServiceInput } from "../schema/service.schema";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Service from "../models/serviceModel";
import { IService } from "../types";

export async function createService(input: CreateServiceInput) {
  return Service.create(input.body);
}

export async function findService(
  query: FilterQuery<IService>,
  options: QueryOptions = { lean: true }
) {
  return Service.findById(query.id, {}, options);
}

export async function updateService(
  query: FilterQuery<IService>,
  update: UpdateQuery<IService>,
  options: QueryOptions = { lean: true, new: true }
) {
  return Service.findByIdAndUpdate(query, update, options);
}

export async function deleteService(
  query: FilterQuery<IService>,
  options: QueryOptions = { lean: true }
) {
  return Service.findByIdAndRemove(query, options);
}

export async function allServices(options: QueryOptions = { lean: true }) {
  return Service.find({}, {}, options);
}
