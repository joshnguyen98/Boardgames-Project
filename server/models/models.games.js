const db = require("../../db/connection");

exports.selectCategories = () => {
    return db.query(`
    SELECT * FROM categories;
    `)
    .then((result) => {
        return result.rows
    })
};

exports.selectReviews = (category, sort_by='created_at', order='desc') => {
    const validOrderQueries = ['asc', 'desc']
    const validSortByQueries = ['title', 'designer', 'owner', 'review_img_url', 'category', 'created_at', 'votes', 'review_id']
    const validCategoryQueries = ['euro game', 'social deduction', 'dexterity', "children's games"]

    if(!validSortByQueries.includes(sort_by) || !validOrderQueries.includes(order) ) {
        return Promise.reject({status: 400, msg: 'Bad Request.'});
    }

    let queryStr = `
    SELECT 
        title, designer, owner, review_img_url, category, reviews.created_at, reviews.votes, reviews.review_id, 
    COUNT (comments.review_id) AS comment_count
    FROM 
        reviews
    LEFT JOIN 
        comments
    ON reviews.review_id = comments.review_id `

    const queryArr = []

    if (category !== undefined) {
        if (!validCategoryQueries.includes(category)) {
            return Promise.reject({status: 404, msg: 'Not Found.'})
        } else {
            queryStr += ` WHERE category = $1 `
            queryArr.push(category)
        }
    }

    queryStr += `
    GROUP BY 
        title, designer, owner, review_img_url, category, reviews.created_at, reviews.votes, reviews.review_id
    ORDER BY ${sort_by} ${order}
    ;`

    return db.query(queryStr, queryArr)
    .then((result) => {
        return result.rows
    })
};

exports.selectReviewById = (id) => {
    return db.query(`
    SELECT 
        title, designer, owner, review_img_url, category, review_body, reviews.created_at, reviews.votes, reviews.review_id, 
    COUNT (comments.review_id) AS comment_count
    FROM 
        reviews
    LEFT JOIN 
        comments
    ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY 
    title, designer, owner, review_img_url, category, review_body, reviews.created_at, reviews.votes, reviews.review_id
    ;`, [id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject( {status: 404, msg: "Not Found."} )
        }
        return result.rows[0]
    })
};

exports.selectCommentsByReviewId = (id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `, [id])
    .then((result) => {
        return result.rows
    })
;}

exports.insertCommentByReviewId = (id, comment) => {
    return db.query(`
    INSERT INTO comments
    (review_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `, [id, comment.username, comment.body])
    .then((result) => {
        return result.rows[0]
    })
}

exports.updateReviewVotesById = (id, inc) => {
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `, [inc, id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject( {status: 404, msg: "Not Found."} )
        }
        return result.rows[0]
    })
}

exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users
    ;`)
    .then((result) => {
        return result.rows
    })
}

exports.removeCommentById = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE 
        comment_id = $1
    RETURNING *
    ;`, [id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found.'})
        }
        return result.rows[0]
    })
}
