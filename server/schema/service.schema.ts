import { object, string, TypeOf, z, number, date } from "zod";
import transformToMongoId from "../utils/transformToMongoID";
const payload = {
  body: object({
    name: string({ required_error: "name is required" }),
    resource: string({ required_error: "resource is required" }).transform(
      (val) => transformToMongoId(val)
    ),
    created_by: string({ required_error: "creator is required" }).transform(
      (val) => transformToMongoId(val)
    ),
    start_date: string({ required_error: "start date is required" }).datetime({
      message: "invalid date-time. It must be in UTC",
    }),
    completion_date: string({
      required_error: "completion date is required",
    }).datetime({
      message: "invalid date-time. It must be in UTC",
    }),
    interval: number({ required_error: "interval is required" }),
    frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"], {
      required_error: "frequency is required",
    }),
  }),
};

const params = {
  params: object({
    serviceId: string({
      required_error: "serviceId is required",
    }),
  }),
};

const queryParams = {
  params: object({
    start_date: string().datetime({
      message: "invalid datetime. It must be UTC",
    }),
    end_date: string().datetime({
      message: "invalid datetime. It must be UTC",
    }),
  }),
};
export const createServiceSchema = object({
  ...payload,
});
export const updateServiceSchema = object({
  ...payload,
  ...params,
});

export const deleteServiceSchema = object({
  ...params,
});

export const getServiceSchema = object({
  ...params,
});

export const allServiceSchema = object({
  ...queryParams,
});

export type CreateServiceInput = TypeOf<typeof createServiceSchema>;
export type ReadServiceInput = TypeOf<typeof getServiceSchema>;
export type UpdateServiceInput = TypeOf<typeof updateServiceSchema>;
export type DeleteServiceInput = TypeOf<typeof deleteServiceSchema>;
export type AllServiceInput = TypeOf<typeof allServiceSchema>;
//query based off of time start & end times
