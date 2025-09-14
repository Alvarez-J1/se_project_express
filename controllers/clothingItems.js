const item = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");

const ForbiddenError = require("../errors/ForbiddenError");

const NotFoundError = require("../errors/NotFoundError");

const getClothingItems = (req, res, next) =>
  item
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return item
    .create({ name, weather, imageUrl, owner })
    .then((createdItem) => res.status(201).send(createdItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data format"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  return item
    .findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((foundItem) => {
      if (foundItem.owner.toString() !== owner) {
        throw new ForbiddenError("You are not allowed to delete this");
      }
      return foundItem.deleteOne().then(() => {
        res.status(200).send({ message: "item deleted successfully" });
      });
    })

    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) =>
  item
    .findByIdAndUpdate(
      req.params.itemId,

      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => res.status(200).send(updatedItem))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data format"));
      }
      return next(err);
    });

const dislikeItem = (req, res, next) =>
  item
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((dislikedItem) => res.status(200).send(dislikedItem))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data format"));
      }
      return next(err);
    });

module.exports = {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
