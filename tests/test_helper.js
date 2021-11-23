const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Engineering blogs",
    author: "Oghenemarho Orukele",
    url: "https://fullstackopen.com",
    likes: 10,
    user: "6198b018b73669894b45192b",
  },
  {
    title: "Programming website",
    author: "Oghenemarho Orukele",
    url: "https://fullstackopen.com",
    likes: 10,
    user: "6198b018b73669894b45192b",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
