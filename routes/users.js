const router = require("express").Router();

const auth = require("../middlewares/auth");

const { createUser, login } = require("../controllers/users");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);
router.post("/signin", login);
router.post("/signup", createUser);
module.exports = router;
