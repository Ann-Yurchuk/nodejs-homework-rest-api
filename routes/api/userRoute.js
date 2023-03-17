const express = require("express");
const { validation, user } = require("../../middlewares");
const { ctrlWrapper } = require("../../utils");
const { joiRegisterSchema, joiLoginSchema, joiSubscriptionSchema } = require("../../models/user");
const {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
} = require("../../controllers/userControllers");

const router = express.Router();

router.post("/register", validation(joiRegisterSchema), ctrlWrapper(register));
router.post("/login", validation(joiLoginSchema), ctrlWrapper(login));
router.get("/current", user, ctrlWrapper(getCurrent));
router.post("/logout", user, ctrlWrapper(logout));
router.patch("/", validation(joiSubscriptionSchema), ctrlWrapper(updateStatusUser));

module.exports = router;
