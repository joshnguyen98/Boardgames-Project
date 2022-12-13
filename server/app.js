const express = require("express");
const { getCategories, getReviews, getReviewById, getCommentsByReviewId } = require("./controllers/controllers.games");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./controllers/controllers.errors");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app;