const request = require("supertest");
const app = require("../api/app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
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

describe("GET:/api/articles", () => {
  test("200:Get article by id (object)", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .get("/api/articles/34890384")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .get("/api/articles/sdsc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      });
  });
});
