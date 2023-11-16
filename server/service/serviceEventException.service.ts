import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ServiceEventException from "../models/serviceEventExceptionModel";
import { IServiceEventException } from "../types";
import { CreateServiceEventInput } from "../schema/serviceEventException.schema";

export async function createServiceEventException(
  input: CreateServiceEventInput
) {
  return ServiceEventException.create(input.body);
}

export async function updateServiceEventException(
  query: FilterQuery<IServiceEventException>,
  update: UpdateQuery<IServiceEventException>,
  options: QueryOptions = { lean: true }
) {
  return ServiceEventException.findByIdAndUpdate(query, update, options);
}

export async function deleteServiceEventException(
  query: FilterQuery<IServiceEventException>,
  options: QueryOptions = { lean: true }
) {
  return ServiceEventException.findByIdAndRemove(query, options);
}

export async function allServiceEventException(
  query: FilterQuery<IServiceEventException>,
  options: QueryOptions = { lean: true }
) {
  return ServiceEventException.find(query, {}, options);
}

export async function findServiceEventException(
  query: FilterQuery<IServiceEventException>,
  options: QueryOptions = { lean: true }
) {
  return ServiceEventException.findOne(query, {}, options);
}

export async function deleteServiceExceptionEventsByService(
  query: FilterQuery<IServiceEventException>,
  options: QueryOptions = { lean: true }
) {
  return ServiceEventException.deleteMany(query, options);
}
