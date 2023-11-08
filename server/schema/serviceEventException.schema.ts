import { object, string, TypeOf, boolean } from "zod";
import transformToMongoId from "../utils/transformToMongoID";
const payload = {
  body: object({
    service: string({ required_error: "service is required" }).transform(
      (val) => transformToMongoId(val)
    ),
    start_date: string({ required_error: "start date is required" }).datetime({
      message: "invalid date-time. It must be in UTC",
    }),
    exception_date: string({
      required_error: "start date is required",
    }).datetime({
      message: "invalid date-time. It must be in UTC",
    }),
    is_cancelled: boolean({ required_error: "interval is required" }),
    is_rescheduled: boolean({ required_error: "interval is required" }),
    created_by: string({ required_error: "creator is required" }).transform(
      (val) => transformToMongoId(val)
    ),
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
const searchByServiceAndStartParams = {
  params: object({
    serviceId: string({
      required_error: "serviceId is required",
    }),
    start_date: string().datetime({
      message: "invalid datetime. It must be UTC",
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

export const getServiceEventExceptionByServiceSchema = object({
  ...searchByServiceParams,
});

export const getEventExceptionsByServiceAndStartSchema = object({
  ...searchByServiceAndStartParams,
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
  typeof getServiceEventExceptionByServiceSchema
>;

export type GetEventExceptionByServiceAndStartInput = TypeOf<
  typeof getEventExceptionsByServiceAndStartSchema
>;
