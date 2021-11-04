const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Engineering blogs",
    author: "Oghenemarho Orukele",
    url: "https://fullstackopen.com",
    likes: 10,
  },
  {
    title: "Programming website",
    author: "Oghenemarho Orukele",
    url: "https://fullstackopen.com",
    likes: 10,
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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
