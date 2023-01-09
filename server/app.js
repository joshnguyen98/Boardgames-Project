const express = require("express");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./controllers/controllers.errors");
const { 
    getCategories, 
    getReviews, 
    getReviewById, 
    getCommentsByReviewId, 
    postCommentByReviewId, 
    patchReviewVotesById, 
    getUsers,
    deleteCommentById,
    getEndpoints
} = require("./controllers/controllers.games");
const cors = require('cors')


const app = express();
app.use(cors())
app.use(express.json())

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotesById);
app.get("/api/users", getUsers)
app.delete("/api/comments/:comment_id", deleteCommentById)
app.get("/api", getEndpoints)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;