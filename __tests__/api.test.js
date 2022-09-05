const request = require("supertest");
const app = require("../api/app");
const db = require("../db/connection");
const { topicData, articleData, userData, commentData } = require("../db/data/test-data");
const seed = require("../db/seeds/seed");


beforeEach(() => {
    return seed({topicData, articleData, userData, commentData})
});

afterAll(() => {
    return db.end();
  });

describe("GET /api/topics", () => {
  test("200: responds with an array of objects with slug and description props ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length > 0).toBe(true);

        body.forEach((obj) => {
          expect(obj).toHaveProperty("slug");
          expect(obj).toHaveProperty("description");
        });
      });
  });
});
