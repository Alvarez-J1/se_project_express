const express = require("express");

const cors = require("cors");

const { NOT_FOUND } = require("./utils/errors");

require("./utils/db");

const app = express();

const { PORT = 3001 } = process.env;

const mainRouter = require("./routes/index");

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
