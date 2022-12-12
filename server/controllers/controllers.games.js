const { selectCategories } = require("../models/models.games");

const getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch((err) => {
        next(err)
    })
};

module.exports = { getCategories };