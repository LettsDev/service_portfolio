export interface IResponseBase {
  __v: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface ILocation extends IResponseBase {
  name: string;
  numResources: number;
}

export interface IUser extends IResponseBase {
  first_name: string;
  last_name: string;
  email: string;
  auth: "USER" | "ENHANCED" | "ADMIN";
}

export interface IResource extends IResponseBase {
  name: string;
  location: ILocation;
  created_by: IUser;
  notes?: string;
  numServices: number;
}

export interface IResourceSubmit extends Pick<IResource, "name" | "notes"> {
  created_by: string;
  location: string;
}

export interface IResourceSubmitEdit extends IResourceSubmit {
  _id: string;
}

export interface IService extends IResponseBase {
  name: string;
  resource: IResource;
  created_by: IUser;
  /**start_date: ISO string */
  start_date: string;
  /**completion_date: ISO string */
  completion_date: string;
  interval: number;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";
}

export interface IServiceDated
  extends Omit<IService, "start_date" | "completion_date"> {
  start_date: Date;
  completion_date: Date;
}

export interface IServiceSubmit
  extends Pick<
    IService,
    "name" | "start_date" | "completion_date" | "interval" | "frequency"
  > {
  created_by: string;
  resource: string;
}

export interface IServiceSubmitEdit extends IServiceSubmit {
  _id: string;
}

export interface IServiceEventException extends IResponseBase {
  service: IService;
  /**
   * exception_date: The date that the event takes place on. ISO string.
   */
  exception_date: string;
  is_cancelled: boolean;
  is_rescheduled: boolean;
  /**
   * start_date: The date that the exception event is from. So from the originally created service event. ISO string.
   */
  start_date: string;
  created_by: IUser;
}

export interface IServiceEventExceptionDated
  extends Omit<IServiceEventException, "start_date" | "exception_date"> {
  start_date: Date;
  exception_date: Date;
}
export interface ISessionResponse extends IResponseBase {
  user: string;
  valid: boolean;
  userAgent: string;
}

export class ExtendedError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ExtendedError";
    this.statusCode = statusCode;
  }
}
//format for creating the calendar events and dates
export interface IDateItem {
  date: Date;
  events: IServiceEventException[];
}
