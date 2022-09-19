'use strict';


require("dotenv").config({});
const express = require("express");
const app = express();
const db = require("./src/models")

const mainRoutes = require("./src/router");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sequelize.sync()

app.use("/", mainRoutes);

module.exports = app;