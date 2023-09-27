//create user login for testing UI
import User from "../../models/userModel";
import Location from "../../models/locationModel";
import { locations, resources, services, users } from "./mockData";
import { ILocation, IResource, IService, IUser } from "../../types";

import Service from "../../models/serviceModel";
import mongoose from "mongoose";
import Resource from "../../models/resourceModel";

export default async function createMockData() {
  async function createLocations(locationData: ILocation[]) {
    return Promise.all(locationData.map((local) => Location.create(local)));
  }

  async function createUsers(
    userData: Omit<
      IUser,
      "createdAt" | "updatedAt" | "validatePassword" | "sanitizePass"
    >[]
  ) {
    return Promise.all(userData.map((user) => User.create(user)));
  }

  async function createResources(
    resourceData: IResource[],
    locationIds: mongoose.Types.ObjectId[],
    userIds: mongoose.Types.ObjectId[]
  ) {
    resourceData.forEach((resource, index) => {
      resource["location"] = locationIds[index];
      resource["created_by"] = userIds[index];
    });
    return Promise.all(
      resourceData.map((resource) => Resource.create(resource))
    );
  }

  async function createServices(
    serviceData: IService[],
    resourceIds: mongoose.Types.ObjectId[],
    userIds: mongoose.Types.ObjectId[]
  ) {
    serviceData.forEach((service, index) => {
      service["created_by"] = userIds[index];
      service["resource"] = resourceIds[index];
    });
    return Promise.all(serviceData.map((serve) => Service.create(serve)));
  }

  const locationModels = await createLocations(locations);
  const userModels = await createUsers(users);
  const resourceModels = await createResources(
    resources,
    locationModels.map((local) => local.id),
    userModels.map((user) => user.id)
  );
  await createServices(
    services,
    resourceModels.map((resource) => resource.id),
    userModels.map((user) => user.id)
  );
}
