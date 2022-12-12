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