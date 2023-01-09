const { 
    selectCategories, 
    selectReviews, 
    selectReviewById, 
    selectCommentsByReviewId,
    insertCommentByReviewId,
    updateReviewVotesById,
    selectUsers,
    removeCommentById,
    selectEndpoints
} = require("../models/models.games");

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        console.log(endpoints)
        res.setHeader("Content-Type", "application/json")
        res.status(200).send(endpoints)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch((err) => {
        next(err)
    })
};

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query
    selectReviews(category, sort_by, order)
    .then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getReviewById = (req, res, next) => {
    const id = req.params.review_id
    selectReviewById(id)
    .then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err)
    })
};

exports.getCommentsByReviewId = (req, res, next) => {
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

exports.postCommentByReviewId = (req, res, next) => {
    const id = req.params.review_id
    const comment = req.body
    
    insertCommentByReviewId(id, comment)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchReviewVotesById = (req, res, next) => {
    const id = req.params.review_id
    const inc = req.body.inc_votes

    updateReviewVotesById(id, inc)
    .then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const id = req.params.comment_id
    removeCommentById(id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}
