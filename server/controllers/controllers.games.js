const { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId } = require("../models/models.games");

const getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch((err) => {
        next(err)
    })
};

const getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch((err) => {
        next(err)
    })
}

const getReviewById = (req, res, next) => {
    const id = req.params.review_id
    selectReviewById(id)
    .then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err)
    })
};

const getCommentsByReviewId = (req, res, next) => {
    const id = req.params.review_id
    const promises = [selectCommentsByReviewId(id), selectReviewById(id)]

    Promise.all(promises)
    .then(([comments]) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getCategories, getReviews, getReviewById, getCommentsByReviewId };