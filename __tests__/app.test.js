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
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String)
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