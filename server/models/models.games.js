const db = require("../../db/connection");

const selectCategories = () => {
    console.log("here")
    return db.query(`SELECT * FROM categories`)
    .then((result) => {
        console.log(result.rows)
        return result.rows
    })
};

module.exports = { selectCategories };