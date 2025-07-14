const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

module.exports = mongoose;
