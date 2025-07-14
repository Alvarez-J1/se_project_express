const mongoose = require("mongoose");
const { MONGO_URL } = require("./utils/config");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

module.exports = mongoose;
