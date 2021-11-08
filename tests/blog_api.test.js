const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
require("express-async-errors");
const api = supertest(app);
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

var token = null;
beforeAll((done) => {
  api
    .post("/api/login")
    .send({
      username: "root",
      password: "sekret",
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe("when there is initially some blogs saved", () => {
  test("should require authorization", async () => {
    api.get("/api/blogs").expect(401);
  });

  test("blogs are returned as json", async () => {
    api
      .get("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", "Bearer " + token);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", "Bearer " + token);

    const titles = response.body.map((r) => r.title);

    expect(titles).toContain("Engineering blogs");
  });

  test("a specific blog is updated", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];
    const payload = {
      ...blogToUpdate,
      likes: 20,
    };
    await api
      .put(`/api/blogs/${payload.id}`, payload)
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });
});

describe("viewing a specific blog", () => {
  test("unique identifier of blog is named id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogOfInterest = blogsAtStart[0];

    expect(blogOfInterest.id).toBeDefined();
    expect(blogOfInterest._id).not.toBeDefined();
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  test("fails with statuscode 400 if blog id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api
      .get(`/api/blogs/${invalidId}`)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });
});

describe("addition of new blog", () => {
  test("fails with Status 401 if token is not provided", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  test("valid blog post should be created", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: "618926dc3c018edb0f30b779",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("blog with no likes data will default to zero likes ", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    const blogOfInterest = blogsAtEnd.find((b) => b.title === newBlog.title);
    expect(blogOfInterest.likes).toBe(0);
  });

  test("blog with title and url returns 400", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("fails with status 401 if token is not provided for blog delete", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });

  test("succeeds with status 200 if token is provided for blog delete", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + token)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    console.log(blogsAtEnd);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
