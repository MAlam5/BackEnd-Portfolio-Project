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

describe("GET /api/articles", () => {
  test("200: responds with articles array with correct props", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length > 0).toBe(true);
        expect(body.articles.length).toBe(5);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("200: responds with articles array sorted by date desc", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: responds with articles array filtered by topic if query is given", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length > 0).toBe(true);
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "cats",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("400: bad request if queried topic doesnt exist ", () => {
    return request(app)
      .get("/api/articles?topic=banananna")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200: responds with empty array if valid topic but no articles ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});
describe("GET:/api/articles/:article_id", () => {
  test("200:Get article by id (object) with comment count", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 6,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: "1",
          })
        );
      });
  });
  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .get("/api/articles/34890384")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .get("/api/articles/sdsc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of commenst for article id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length > 0).toBe(true);

        expect(body.comments.length).toBe(2);

        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .get("/api/articles/34890384/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .get("/api/articles/sdsc/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200: responds with empty array if valid id but no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});
describe("PATCH:/api/articles:article_id/", () => {
  test("200:update votes on article by id (returns updated object)", () => {
    return request(app)
      .patch("/api/articles/6")
      .expect(200)
      .send({ inc_votes: 100 })
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "A",
            topic: "mitch",
            article_id: 6,
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 100,
          })
        );
      });
  });
  test("200:update votes on article by id removing votes (returns updated object)", () => {
    return request(app)
      .patch("/api/articles/6")
      .expect(200)
      .send({ inc_votes: -100 })
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "A",
            topic: "mitch",
            article_id: 6,
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: -100,
          })
        );
      });
  });
  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .patch("/api/articles/34890384")
      .expect(404)
      .send({ inc_votes: 100 })
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .patch("/api/articles/sdsc")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: body has object but no inc_votes key", () => {
    return request(app)
      .patch("/api/articles/sdsc")
      .expect(400)
      .send({ banana: 100 })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: body has inc_votes, but with other keys", () => {
    return request(app)
      .patch("/api/articles/sdsc")
      .expect(400)
      .send({ inc_votes: 100, banana: "100" })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: body has inc_votes, but invalid data type (str)", () => {
    return request(app)
      .patch("/api/articles/6")
      .expect(400)
      .send({ inc_votes: "bread", banana: "100" })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of objects with slug and description props ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length > 0).toBe(true);
        expect(body.users.length).toBe(4);

        body.users.forEach((obj) => {
          expect(obj).toHaveProperty("username");
          expect(obj).toHaveProperty("name");
          expect(obj).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: responds with status only", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .delete("/api/comments/798")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .delete("/api/comments/lijuhb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
