require("dotenv").config();

const express = require("express");

const cors = require("cors");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { NOT_FOUND } = require("./utils/errors");

require("./utils/db");

const app = express();

const { PORT = 3001 } = process.env;

app.use(requestLogger);

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");

const { errors } = require("celebrate");

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

app.use(requestLogger);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
