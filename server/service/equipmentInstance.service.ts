import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { CreateEquipmentInstanceInput } from "../schema/equipmentInstance.schema";
import EquipmentInstance from "../models/equipmentInstanceModel";
import { IEquipmentInstance } from "../types";

export async function createEquipmentInstance(
  input: CreateEquipmentInstanceInput
) {
  return EquipmentInstance.create(input.body);
}

export async function findEquipmentInstance(
  query: FilterQuery<IEquipmentInstance>,
  options: QueryOptions = { lean: true }
) {
  return EquipmentInstance.findById(query.id, {}, options);
}

export async function updateEquipmentInstance(
  query: FilterQuery<IEquipmentInstance>,
  update: UpdateQuery<IEquipmentInstance>,
  options: QueryOptions = { lean: true, new: true }
) {
  return EquipmentInstance.findByIdAndUpdate(query, update, options);
}

export async function deleteEquipmentInstance(
  query: FilterQuery<IEquipmentInstance>,
  options: QueryOptions = { lean: true }
) {
  return EquipmentInstance.findByIdAndRemove(query, options);
}

export async function allEquipmentInstance(
  options: QueryOptions = { lean: true }
) {
  return EquipmentInstance.find({}, {}, options);
}
