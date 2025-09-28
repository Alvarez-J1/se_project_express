const router = require("express").Router();

const { validateUpdateUser } = require("../middlewares/validation");

const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, updateProfile);

module.exports = router;
