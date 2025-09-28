const router = require("express").Router();

const {
  validateItemIdParam,
  validateClothingItemBody,
} = require("../middlewares/validation");

const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItemBody, createItem);
router.delete("/:itemId", auth, validateItemIdParam, deleteItem);
router.put("/:itemId/likes", auth, validateItemIdParam, likeItem);
router.delete("/:itemId/likes", auth, validateItemIdParam, dislikeItem);

module.exports = router;
