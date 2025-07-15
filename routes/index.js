const router = require("express").Router();

const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signin", login);
router.post("/signup", createUser);
module.exports = router;
