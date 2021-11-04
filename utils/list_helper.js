const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  var totalLikes = 0;
  blogs.forEach((blog) => {
    totalLikes += blog.likes;
  });

  return totalLikes;
};

const favoriteBlog = (blogs) => {
  const max = Math.max.apply(
    Math,
    blogs.map((o) => o.likes)
  );

  const blog = blogs.find((b) => b.likes === max);
  const result = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  };

  return result;
};

const mostBlogs = (blogs) => {
  const authors = lodash.map(blogs, "author");
  const mostCommonAuthor = lodash
    .chain(authors)
    .countBy()
    .toPairs()
    .max(lodash.last)
    .head()
    .value();
  const blogsByAuthor = blogs.filter(
    (blog) => blog.author === mostCommonAuthor
  );
  const result = {
    author: mostCommonAuthor,
    blogs: blogsByAuthor.length,
  };
  return result;
};

const mostLikes = (blogs) => {
  const result = lodash(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, "likes"),
    }))
    .orderBy("likes", "desc")
    .head();

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
