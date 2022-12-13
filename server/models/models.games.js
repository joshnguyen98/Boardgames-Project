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
};

const selectReviewById = (id) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1;
    `, [id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject( {status: 404, msg: "Not Found."} )
        }
        return result.rows[0]
    })
};

const selectCommentsByReviewId = (id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `, [id])
    .then((result) => {
        return result.rows
    })
;}

module.exports = { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId };
