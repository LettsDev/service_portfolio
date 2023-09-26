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
    start_date: date({ required_error: "start date is required" }),
    completion_date: date({ required_error: "completion date is required" }),
    interval: number({ required_error: "interval is required" }),
    frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"], {
      required_error: "frequency is required",
    }),
  }),
};

const params = {
  params: object({
    serviceEventId: string({
      required_error: "serviceEventId is required",
    }),
  }),
};
const searchByServiceParams = {
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
export const createServiceEventExceptionSchema = object({
  ...payload,
});
export const updateServiceEventExceptionSchema = object({
  ...payload,
  ...params,
});

export const deleteServiceEventExceptionSchema = object({
  ...params,
});

export const getServiceEventExceptionSchema = object({
  ...queryParams,
});

export const getServiceEventExceptionByService = object({
  ...searchByServiceParams,
});

export type CreateServiceEventInput = TypeOf<
  typeof createServiceEventExceptionSchema
>;
export type ReadServiceEventInput = TypeOf<
  typeof getServiceEventExceptionSchema
>;
export type UpdateServiceEventInput = TypeOf<
  typeof updateServiceEventExceptionSchema
>;
export type DeleteServiceEventInput = TypeOf<
  typeof deleteServiceEventExceptionSchema
>;

export type ServiceSearchServiceEventInput = TypeOf<
  typeof getServiceEventExceptionByService
>;
