const express = require("express");

const mongoose = require("mongoose");

const { NOT_FOUND } = require("./utils/errors");

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
app.use((req, res, next) => {
  req.user = {
    _id: "6851e7c0a9e4ed486ee4ce16", // paste the _id of the test user created in the previous step
  };
  next();
});
app.use("/", mainRouter);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
