const mainRoute = require("express").Router();
const activityRoute = require("./activityRoute");
const todoRoute = require("./todoRoute");

mainRoute.use("/activity-groups", activityRoute);
mainRoute.use("/todo-items", todoRoute);

module.exports = mainRoute