const router = require("express").Router();

const itemRouter = require("./clothingItems");

const auth = require("../middlewares/auth");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
