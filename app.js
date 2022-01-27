require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const userRouter = require("./controllers/users");
const cors = require("cors");
const middleware = require("./utils/middleware");
const projectRouter = require("./controllers/projects");
const loginRouter = require("./controllers/login");

logger.info("Connecting to ", process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("connected"))
  .catch((err) => logger.error("error has occurred", err.message));

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(express.static("build"));
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
