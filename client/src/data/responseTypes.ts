export interface IResponseBase {
  __v: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface ILocation extends IResponseBase {
  name: string;
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
}

//dates will be ISO strings
export interface IService extends IResponseBase {
  name: string;
  resource: IResource;
  created_by: IUser;
  start_date: string;
  completion_date: string;
  interval: number;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";
}

export interface IServiceEventException extends IResponseBase {
  service: IService;
  exception_date: Date;
  is_cancelled: boolean;
  is_rescheduled: boolean;
  start_date: Date;
  created_by: IUser;
}
