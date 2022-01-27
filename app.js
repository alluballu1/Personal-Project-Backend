require("dotenv").config();
const express = require("express")
const app = express()
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
app.use(express.static("build"));
app.use(express.json());

app.use(middleware.tokenExtractor)
app.use("/api/users", userRouter)
app.use("/api/projects", projectRouter)
app.use("/api/login", loginRouter)
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;