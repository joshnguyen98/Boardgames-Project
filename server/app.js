const express = require("express");
const { getCategories } = require("./controllers/controllers.games");

const app = express();

app.get("/api/categories", getCategories)

module.exports = app;