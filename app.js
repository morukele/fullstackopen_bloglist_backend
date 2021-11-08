const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const app = express();

logger.info("connecting to mongoDB");

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(
  "/api/blogs",
  middleware.tokenExtractor,
  middleware.userExtractor,
  blogsRouter
);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
