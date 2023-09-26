import { object, string, TypeOf } from "zod";

const payload = {
  body: object({
    name: string({ required_error: "Name is required" }),
  }),
};

const params = {
  params: object({
    locationId: string({
      required_error: "locationId is required",
    }),
  }),
};

export const createLocationSchema = object({
  ...payload,
});
export const updateLocationSchema = object({
  ...payload,
  ...params,
});

export const deleteLocationSchema = object({
  ...params,
});

export const getLocationSchema = object({
  ...params,
});

export type CreateLocationInput = TypeOf<typeof createLocationSchema>;
export type UpdateLocationInput = TypeOf<typeof updateLocationSchema>;
export type ReadLocationInput = TypeOf<typeof getLocationSchema>;
export type DeleteLocationInput = TypeOf<typeof deleteLocationSchema>;
