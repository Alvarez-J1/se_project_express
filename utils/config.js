const { JWT_SECRET = "some-very-strong-key", MONGO_URL } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
