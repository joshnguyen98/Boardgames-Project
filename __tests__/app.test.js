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
            expect(review).toBeInstanceOf(Object)
            expect(review).toEqual(expect.objectContaining({
                owner: "philippaclaire9",
                title: "Jenga",
                review_id: 2,
                category: "dexterity",
                review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                designer: "Leslie Scott"
            }))
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
        .post("/api/reviews/999999/comments")
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
            expect(body.msg).toBe("Username Doesn't Exist in the Database.")
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
            expect(body.msg).toBe("Comment Missing Required Data.")
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
            expect(body.msg).toBe("Comment Missing Required Data.")
        })
    })
})