import { CreateLocationInput } from "../schema/location.schema";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Location from "../models/locationModel";
import { ILocation } from "../types";

export async function createLocation(input: CreateLocationInput) {
  return Location.create(input.body);
}

export async function findLocation(
  query: FilterQuery<ILocation>,
  options: QueryOptions = { lean: true }
) {
  return Location.findById(query.id, {}, options);
}

export async function updateLocation(
  query: FilterQuery<ILocation>,
  update: UpdateQuery<ILocation>,
  options: QueryOptions = { lean: true, new: true }
) {
  return Location.findByIdAndUpdate(query, update, options);
}

export async function deleteLocation(
  query: FilterQuery<ILocation>,
  options: QueryOptions = { lean: true }
) {
  return Location.findByIdAndRemove(query, options);
}

export async function allLocations(options: QueryOptions = { lean: true }) {
  return Location.find({}, {}, options);
}
