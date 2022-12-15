const app = require("../server/app");
const request = require("supertest");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => db.end()) ;
beforeEach(() => seed(testData));

describe("GET /api/categories", () => {
    test("200: returns an array of objects, with properties of slug and description ", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(( { body } ) => {
            const categories = body.categories
            expect(categories).toBeInstanceOf(Array)
            expect(categories).toHaveLength(4)
            categories.forEach((category) => {
                expect(category).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    })
})

describe("GET /api/reviews", () => {
    test("200: returns an array of objects, including comment_count and sorted by descending order", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(( { body } ) => {
            const reviews = body.reviews
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(13)
            expect(reviews).toBeSorted('created_at', { descending: true })
            reviews.forEach((review) => {
                expect(review).toEqual(expect.objectContaining({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(String)
                }))
            })
        })
    })
})

describe("GET /api/reviews/:review_id", () => {
    test("200: returns a review object with specified review_id", () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(( { body } ) => {
            const review = body.review
            expect(review).toMatchObject({
                owner: "philippaclaire9",
                title: "Jenga",
                review_id: 2,
                category: "dexterity",
                review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                designer: "Leslie Scott"
            })
        })
    })
    test("404: valid id but doesn't exist", () => {
        return request(app)
        .get("/api/reviews/999999")
        .expect(404)
        .then(( { body } ) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("400: id is not an integer", () => {
        return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
})

describe("GET /api/reviews/:review_id/comments", () => {
    test("200: returns an array of comments for a given review_id with specific properties", () => {
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(( { body } ) => {
            const comments = body.comments
            expect(comments).toBeInstanceOf(Array)
            expect(comments).toHaveLength(3)
            expect(comments).toBeSorted('created_at', { descending: true })
            comments.forEach((comment) => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect.any(Number)
                }))
            })
        })
    })
    test("200: returns an empty array when the given review_id has no comments", () => {
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(( { body } ) => {
            const comments = body.comments
            expect(comments).toBeInstanceOf(Array)
            expect(comments).toHaveLength(0)
        })
    })
    test("404: valid id but doesn't exist", () => {
        return request(app)
        .get("/api/reviews/999999/comments")
        .expect(404)
        .then(( { body } ) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("400: id is not an integer", () => {
        return request(app)
        .get("/api/reviews/hello/comments")
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
})

describe("POST /api/reviews/:review_id/comments", () => {
    test("201: responds with the posted comment", () => {
        const testComment = {
            username: "mallionaire",
            body: "I love this board game!"
        }
        return request(app)
        .post("/api/reviews/2/comments")
        .send(testComment)
        .expect(201)
        .then(( { body } ) => {
            expect(body.comment).toEqual({
                review_id: 2,
                author: "mallionaire",
                body: "I love this board game!",
                votes: 0,
                comment_id: 7,
                created_at: expect.any(String)
            })
        })
    })
    test("400: Invalid ID type", () => {
        const testComment = {
            username: "mallionaire",
            body: "I love this board game!"
        }
        return request(app)
        .post("/api/reviews/hello/comments")
        .send(testComment)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test("404: ID doesn't exist", () => {
        const testComment = {
            username: "mallionaire",
            body: "I love this board game!"
        }
        return request(app)
        .post("/api/reviews/99/comments")
        .send(testComment)
        .expect(404)
        .then(( { body } ) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("404: Username doesn't exist in user database", () => {
        const testComment = {
            username: "Josh",
            body: "I love this board game!"
        }
        return request(app)
        .post("/api/reviews/2/comments")
        .send(testComment)
        .expect(404)
        .then(( { body } ) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("400: Comment doesn't contain username", () => {
        const testComment = {
            body: "I love this board game!"
        }
        return request(app)
        .post("/api/reviews/2/comments")
        .send(testComment)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test("400: Comment doesn't contain body", () => {
        const testComment = {
            username: "mallionaire",
        }
        return request(app)
        .post("/api/reviews/2/comments")
        .send(testComment)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
    test("200: increments review votes by newvote property and returns updated review", () => {
        const reviewUpdate = { inc_votes: 1}
        return request(app)
        .patch("/api/reviews/2")
        .send(reviewUpdate)
        .expect(200)
        .then(( { body } ) => {
            const review = body.review
            expect(review).toEqual(expect.objectContaining({
                owner: "philippaclaire9",
                title: "Jenga",
                review_id: 2,
                category: "dexterity",
                review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 6,
                designer: "Leslie Scott"
            }))
        })
    })
    test("200: increments review votes by newvote property and returns updated review, with only votes updated", () => {
        const reviewUpdate = { inc_votes: 1, owner: "josh"}
        return request(app)
        .patch("/api/reviews/2")
        .send(reviewUpdate)
        .expect(200)
        .then(( { body } ) => {
            const review = body.review
            expect(review).toEqual(expect.objectContaining({
                owner: "philippaclaire9",
                title: "Jenga",
                review_id: 2,
                category: "dexterity",
                review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 6,
                designer: "Leslie Scott"
            }))
        })
    })
    test("404: ID doesn't exist", () => {
        const reviewUpdate = { inc_votes: 1 }
        return request(app)
        .patch("/api/reviews/999999")
        .send(reviewUpdate)
        .expect(404)
        .then(( { body } ) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("400: Invalid ID type", () => {
        const reviewUpdate = { inc_votes: 1}
        return request(app)
        .patch("/api/reviews/hello")
        .send(reviewUpdate)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test("400: Increment is not a number", () => {
        const reviewUpdate = { inc_votes: "hello"}
        return request(app)
        .patch("/api/reviews/2")
        .send(reviewUpdate)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test("400: Empty key", () => {
        const reviewUpdate = {}
        return request(app)
        .patch("/api/reviews/2")
        .send(reviewUpdate)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test("400: Invalid", () => {
        const reviewUpdate = { bob: "bob"}
        return request(app)
        .patch("/api/reviews/2")
        .send(reviewUpdate)
        .expect(400)
        .then(( { body } ) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })

})

describe("GET /api/users", () => {
    test("200: returns an array of user objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(( { body } ) => {
            const users = body.users
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
        })
    })
})

describe("GET /api/users (queries)", () => {
    test('200: accepts sort_by query; title', () => {
        return request(app)
        .get('/api/reviews?sort_by=title')
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toBeSortedBy('title', { descending: true })
        })
    })
    test('400: bad sort_by query', () => {
        return request(app)
        .get('/api/reviews?sort_by=hello')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test('200: accepts order query; asc', () => {
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toBeSortedBy('created_at')
        })
    })
    test('400: bad sort_by ', () => {
        return request(app)
        .get('/api/reviews?order=hello')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request.")
        })
    })
    test('200: accepts category; dexterity', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({body: {reviews}}) => {
            reviews.forEach((review) => {
                expect(review.category).toBe("dexterity")
            })
        })
    })
    test('404: category not found ', () => {
        return request(app)
        .get('/api/reviews?category=office')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found.")
        })
    })
    test("200: returns an empty array for a valid category with no reviews", () => {
        return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toMatchObject([])
        })
    })
})

describe("GET /api/review/:review_id (comment count)", () => {
    test("200: returns a review object with specified review_id including comment count", () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(( { body } ) => {
            const review = body.review
            expect(review).toMatchObject({
                owner: "philippaclaire9",
                title: "Jenga",
                review_id: 2,
                category: "dexterity",
                review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                designer: "Leslie Scott",
                comment_count: "3"
            })
        })
    })
})
