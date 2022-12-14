const express = require("express");
const { getCategories, getReviews, getReviewById, getCommentsByReviewId, postCommentByReviewId } = require("./controllers/controllers.games");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./controllers/controllers.errors");

const app = express();
app.use(express.json())

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app;