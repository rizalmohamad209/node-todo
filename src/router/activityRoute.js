const activityRoute = require("express").Router();
const activityController = require("../controllers/activityController");
const { validatePost, validateDelete, validateGetById, validateUpdate } = require("../validation/validationActivity")

activityRoute.get("/", activityController.getAllActivity);
activityRoute.post("/", validatePost, activityController.postActivity);
activityRoute.get("/:id", validateGetById, activityController.getActivityById);
activityRoute.patch("/:id", validateUpdate, activityController.updateActivity);
activityRoute.delete("/:id", validateDelete, activityController.deleteActivity);

module.exports = activityRoute;