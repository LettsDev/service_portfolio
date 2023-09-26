import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ServiceEventException from "../models/serviceEventExceptionModel";
import { IServiceEventException } from "../types";
import { CreateServiceEventInput } from "../schema/serviceEventException.schema";

export async function createServiceEventException(
  input: CreateServiceEventInput
) {
  return (
    await (await ServiceEventException.create(input.body)).populate("service")
  ).populate("created_by");
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
