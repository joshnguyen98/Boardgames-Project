const express = require("express");
const {} = require("./controllers/controllers.errors");
const { getCategories } = require("./controllers/controllers.games");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories)

module.exports = app;