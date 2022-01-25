require("dotenv").config();
const app = require("./app");
const logger = require("./utils/logger");
const http = require("http");
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});
