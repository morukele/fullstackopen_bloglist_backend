const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body);
  if (updatedBlog) {
    response.status(200).json(updatedBlog);
  } else {
    response.status(404).end;
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() === user.id) {
    blog.delete();
    response.status(200).json({ success: "Blog Deleted" });
  }

  response.status(401).json({ error: "invalid user" });
});

module.exports = blogsRouter;
