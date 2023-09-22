import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ServiceSchedule from "../models/serviceScheduleModel";
import { IServiceSchedule } from "../types";
import { CreateServiceScheduleInput } from "../schema/serviceSchedule.schema";

export async function createServiceSchedule(input: CreateServiceScheduleInput) {
  return ServiceSchedule.create(input.body);
}

export async function updateServiceSchedule(
  query: FilterQuery<IServiceSchedule>,
  update: UpdateQuery<IServiceSchedule>,
  options: QueryOptions = { lean: true }
) {
  return ServiceSchedule.findByIdAndUpdate(query, update, options);
}

export async function deleteServiceSchedule(
  query: FilterQuery<IServiceSchedule>,
  options: QueryOptions = { lean: true }
) {
  return ServiceSchedule.findByIdAndRemove(query, options);
}

export async function allServiceSchedule(
  options: QueryOptions = { lean: true }
) {
  return ServiceSchedule.find({}, {}, options);
}

export async function findServiceSchedule(
  query: FilterQuery<IServiceSchedule>,
  options: QueryOptions = { lean: true }
) {
  return ServiceSchedule.findById(query.id, {}, options);
}

export function findServiceScheduleInRange(
  query: FilterQuery<IServiceSchedule>,
  options: QueryOptions = { lean: true }
) {
  return ServiceSchedule.find(query, {}, options);
}
