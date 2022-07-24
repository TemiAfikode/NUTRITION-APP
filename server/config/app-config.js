"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const routes = require("../routes");

// Make sure you place body-parser before your CRUD handlers!
// Body-parser is a middleware. They help to tidy up the request object before we use them
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.use("/api", routes);

module.exports = app;
