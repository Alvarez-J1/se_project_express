const item = require("../models/clothingItem");
const user = require("../models/user");
const {
  badRequest,
  internalServerError,
  notFound,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  item
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(internalServerError).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  item
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  item
    .findByIdAndDelete(itemId)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res.send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        console.error(err);
        return res.status(badRequest).send({ message: "Invalid item ID" });
      }
      return res.status(internalServerError).send({ message: "Server error" });
    });
};

const likeItem = (req, res) => {
  item
    .findByIdAndUpdate(
      req.params.itemId,

      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(badRequest).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  item
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(badRequest).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
