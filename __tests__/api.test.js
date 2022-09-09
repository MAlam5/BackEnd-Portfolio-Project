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

describe("GET /api", () => {
  test("reponds with json of current endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.hasOwnProperty("endpoints")).toBe(true);
        expect(typeof body.endpoints).toBe("object");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of objects with slug and description props ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length > 0).toBe(true);

        body.topics.forEach((obj) => {
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
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
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
              comment_count: expect.any(Number),
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
  test("200 queries: sort_by in correct order (default: desc)", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("200 queries: order in correct order (NO sort_by)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("200 queries: order in correct order with sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeSortedBy("title");
      });
  });
  test("400 queries: sort_by column that doesnt exist", () => {
    return request(app)
      .get("/api/articles?sort_by=fdweilkhjb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400 queries: order not valid ", () => {
    return request(app)
      .get("/api/articles?order=upward")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200 queries: topic with sort and order ", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length > 0).toBe(true);
        expect(body.articles.length).toBe(11);
        expect(body.articles).toBeSortedBy("created_at");
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
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

describe("GET: /api/users/userame", () => {
  test("200: responds with user object with correct props", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'icellusedkars',
            avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
            name: 'sam',
          })
        );
      });
  });
  test("404: invalid id doesnt exist", () => {
    return request(app)
      .get("/api/users/usernamedoestexist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .expect(201)
      .send({ username: "icellusedkars", body: "Something smells fishy" })
      .then(({ body }) => {
        expect(body.postedComment).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            article_id: 5,
            body: "Something smells fishy",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("404: invalid id doesnt exist(still a number)", () => {
    return request(app)
      .post("/api/articles/432890/comments")
      .expect(404)
      .send({ username: "icellusedkars", body: "Something smells fishy" })
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid id (string)", () => {
    return request(app)
      .post("/api/articles/bwdwdsx/comments")
      .send({ username: "icellusedkars", body: "Something smells fishy" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: body has object but noo username key ", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .expect(400)
      .send({ dfnj: "icellusedkars", body: "Something smells fishy" })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: body has object but no body key ", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .expect(400)
      .send({ username: "icellusedkars", edf: "Something smells fishy" })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: username doesnt exist", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .expect(400)
      .send({ username: "ijbncd", body: "Something smells fishy" })
      .then(({ body }) => {
        expect(body.msg).toBe("user doesn't exist");
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
