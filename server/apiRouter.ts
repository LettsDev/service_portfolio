import express from "express";
import {
  locationController,
  resourceController,
  serviceController,
  serviceEventController,
  sessionController,
  userController,
} from "./controllers";
import validate from "./middleware/validateRequest";
import {
  requireAdmin,
  requireEnhanced,
  requireUser,
} from "./middleware/requireAuth";
import { createSessionSchema } from "./schema/session.schema";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "./schema/user.schema";
import {
  getLocationSchema,
  updateLocationSchema,
  createLocationSchema,
  deleteLocationSchema,
} from "./schema/location.schema";
import {
  getResourceSchema,
  updateResourceSchema,
  deleteResourceSchema,
  createResourceSchema,
  queryByLocationSchema,
} from "./schema/resource.schema";
import {
  getServiceSchema,
  createServiceSchema,
  updateServiceSchema,
  deleteServiceSchema,
  allServiceSchema,
  queryByResourceSchema,
} from "./schema/service.schema";
import {
  getServiceEventExceptionSchema,
  createServiceEventExceptionSchema,
  updateServiceEventExceptionSchema,
  deleteServiceEventExceptionSchema,
  getEventExceptionsByServiceAndStartSchema,
} from "./schema/serviceEventException.schema";
const router = express.Router();

// ****************Session****************
router.get("/session", requireUser, sessionController.getUserSession);
router.post(
  "/session",
  validate(createSessionSchema),
  sessionController.createUserSession
);
router.delete("/session", requireUser, sessionController.deleteUserSession);
// ****************User****************
router.post("/user", [validate(createUserSchema)], userController.create);
router.get("/user/:userId", validate(getUserSchema), userController.get);
router.put(
  "/user/:userId",
  [requireAdmin, validate(updateUserSchema)],
  userController.update
);
router.delete(
  "/user/:userId",
  [requireAdmin, validate(deleteUserSchema)],
  userController.remove
);
router.get("/user", requireAdmin, userController.all);
router.get("/me", requireUser, userController.currentUser);
// ****************Location****************
router.get(
  "/location/:locationId",
  [requireUser, validate(getLocationSchema)],
  locationController.get
);
router.post(
  "/location",
  [requireAdmin, validate(createLocationSchema)],
  locationController.create
);
router.put(
  "/location/:locationId",
  [requireAdmin, validate(updateLocationSchema)],
  locationController.edit
);
router.delete(
  "/location/:locationId",
  [requireAdmin, validate(deleteLocationSchema)],
  locationController.remove
);

router.get("/location", requireUser, locationController.all);
// ****************Resource****************
router.get(
  "/resource/:resourceId",
  [requireUser, validate(getResourceSchema)],
  resourceController.get
);
router.post(
  "/resource",
  [requireEnhanced, validate(createResourceSchema)],
  resourceController.create
);

router.put(
  "/resource/:resourceId",
  [requireEnhanced, validate(updateResourceSchema)],
  resourceController.edit
);

router.delete(
  "/resource/:resourceId",
  [requireEnhanced, validate(deleteResourceSchema)],
  resourceController.remove
);
router.get(
  "/resource/query_location/:locationId",
  [requireUser, validate(queryByLocationSchema)],
  resourceController.queryByLocation
);
router.get("/resource", requireUser, resourceController.all);

// ****************Service****************

router.get("/service", requireUser, serviceController.all);

router.get(
  "/service/:serviceId",
  [requireUser, validate(getServiceSchema)],
  serviceController.get
);
router.post(
  "/service",
  [requireEnhanced, validate(createServiceSchema)],
  serviceController.create
);
router.put(
  "/service/:serviceId",
  [requireEnhanced, validate(updateServiceSchema)],
  serviceController.edit
);
router.delete(
  "/service/:serviceId",
  [requireEnhanced, validate(deleteServiceSchema)],
  serviceController.remove
);
router.get(
  "/service_query/resource/:resourceId",
  [requireUser, validate(queryByResourceSchema)],
  serviceController.queryByResource
);

router.get(
  "/service/:start_date/:end_date",
  [requireUser, validate(allServiceSchema)],
  serviceController.queryByDate
);

// ****************ServiceEvents****************
router.get(
  "/serviceEvent/:serviceId",
  [requireUser, validate(getServiceEventExceptionSchema)],
  serviceEventController.getAllByService
);

router.post(
  "/serviceEvent",
  [requireUser, validate(createServiceEventExceptionSchema)],
  serviceEventController.create
);
router.put(
  "/serviceEvent/:serviceEventId",
  [requireUser, validate(updateServiceEventExceptionSchema)],
  serviceEventController.update
);
router.delete(
  "/serviceEvent/:serviceEventId",
  [requireEnhanced, validate(deleteServiceEventExceptionSchema)],
  serviceEventController.remove
);

router.get(
  "/serviceEvent/:start_date/:end_date",
  requireUser,
  serviceEventController.getAllInDateRange
);
router.get(
  "/serviceEvent/search/:serviceId/:start_date",
  [requireUser, validate(getEventExceptionsByServiceAndStartSchema)],
  serviceEventController.getByStartDateAndService
);
export default router;
