require("dotenv").config();

const express = require("express");

const cors = require("cors");

const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const NotFoundError = require("./errors/NotFoundError");

require("./utils/db");

const app = express();

const { PORT = 3001 } = process.env;

app.use(requestLogger);

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");

app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.get("/", (req, res) => {
  res.json({ message: "WTWR API is running!" });
});

app.use("/", mainRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
