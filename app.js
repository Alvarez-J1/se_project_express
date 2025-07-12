const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const { NOT_FOUND } = require("./utils/errors");

const { createUser, login } = require("./controllers/users");

const app = express();

const { PORT = 3001 } = process.env;

const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
