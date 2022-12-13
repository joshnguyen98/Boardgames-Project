const db = require("../../db/connection");

const selectCategories = () => {
    return db.query(`SELECT * FROM categories`)
    .then((result) => {
        return result.rows
    })
};

const selectReviews = () => {
    return db.query(`
    SELECT 
        title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id, 
    COUNT (comments.review_id) AS comment_count
    FROM 
        reviews
    LEFT JOIN 
        comments
    ON reviews.review_id = comments.review_id
    GROUP BY 
        title, designer, owner, review_img_url, category, reviews.created_at, reviews.votes, reviews.review_id
    ORDER BY created_at DESC
    ;`)
    .then((result) => {
        return result.rows
    })
}

module.exports = { selectCategories, selectReviews };