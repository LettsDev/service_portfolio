import { CreateEquipmentInput } from "../schema/equipment.schema";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Equipment from "../models/equipmentModel";
import { IEquipment } from "../types";

export async function createEquipment(input: CreateEquipmentInput) {
  return Equipment.create(input.body);
}

export async function findEquipment(
  query: FilterQuery<IEquipment>,
  options: QueryOptions = { lean: true }
) {
  return Equipment.findById(query.id, {}, options);
}

export async function updateEquipment(
  query: FilterQuery<IEquipment>,
  update: UpdateQuery<IEquipment>,
  options: QueryOptions = { lean: true, new: true }
) {
  return Equipment.findByIdAndUpdate(query, update, options);
}

export async function deleteEquipment(
  query: FilterQuery<IEquipment>,
  options: QueryOptions = { lean: true }
) {
  return Equipment.findByIdAndRemove(query, options);
}

export async function allEquipment(options: QueryOptions = { lean: true }) {
  return Equipment.find({}, {}, options);
}
