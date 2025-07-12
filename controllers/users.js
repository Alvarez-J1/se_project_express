const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const user = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({ name, avatar, email, password: hash }))
    .then((createdUser) => {
      const userWithoutPassword = createdUser.toObject(); // convert to plain Object
      delete userWithoutPassword.password; // remove password  field
      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Full error object:", err); // Add this line
      console.error("Error name:", err.name); // Add this line
      console.error("Error code:", err.code); // Add this line
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  return user
    .findById(_id)
    .orFail()
    .then((foundUser) => res.status(200).send(foundUser))
    .catch((err) => {
      console.error("Error in getCurrentUser:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  user
    .findUserByCredentials(email, password)

    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    )
    .then((updatedUser) => res.status(200).send(updatedUser))

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User Not Found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid User Data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };
