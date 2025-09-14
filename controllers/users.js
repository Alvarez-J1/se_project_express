const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const user = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");

const NotFoundError = require("../errors/NotFoundError");

const ConflictError = require("../errors/ConflictError");

const UnathorizedError = require("../errors/UnauthorizedError");

const createUser = (req, res, next) => {
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
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return user
    .findById(_id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((foundUser) => res.status(200).send(foundUser))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  return user
    .findUserByCredentials(email, password)

    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnathorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};
const updateProfile = (req, res, next) => {
  const update = {};
  if (typeof req.body.name === "string") update.name = req.body.name.trim();
  if (typeof req.body.avatar === "string")
    update.avatar = req.body.avatar.trim();

  return user
    .findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    })
    .orFail(() => {
      throw new NotFoundError("User Not Found");
    })
    .then((updatedUser) => res.status(200).send(updatedUser))

    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};
module.exports = { createUser, login, getCurrentUser, updateProfile };
