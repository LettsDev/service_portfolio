import { object, string, TypeOf } from "zod";
import transformToMongoId from "../utils/transformToMongoID";
const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    location: string({ required_error: "location is required" }).transform(
      (val) => transformToMongoId(val)
    ),
    created_by: string({ required_error: "creator is required" }).transform(
      (val) => transformToMongoId(val)
    ),
    notes: string().optional(),
  }),
};

const params = {
  params: object({
    resourceId: string({
      required_error: "resourceId is required",
    }),
  }),
};

const queryByLocationParams = {
  params: object({
    locationId: string({
      required_error: "locationId is required",
    }),
  }),
};

export const createResourceSchema = object({
  ...payload,
});

export const updateResourceSchema = object({
  ...payload,
  ...params,
});

export const deleteResourceSchema = object({
  ...params,
});

export const getResourceSchema = object({
  ...params,
});

export const queryByLocationSchema = object({
  ...queryByLocationParams,
});

export type CreateResourceInput = TypeOf<typeof createResourceSchema>;
export type ReadResourceInput = TypeOf<typeof getResourceSchema>;
export type UpdateResourceInput = TypeOf<typeof updateResourceSchema>;
export type DeleteResourceInput = TypeOf<typeof deleteResourceSchema>;
export type QueryByLocationInput = TypeOf<typeof queryByLocationSchema>;
