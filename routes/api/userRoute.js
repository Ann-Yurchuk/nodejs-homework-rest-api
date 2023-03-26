const express = require("express");
const { validation, user, upload } = require("../../middlewares");
const {
  ctrlWrapper,
  joiRegisterSchema,
  joiLoginSchema,
  joiSubscriptionSchema,
} = require("../../utils");
const {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
} = require("../../controllers/userControllers");

const router = express.Router();

router.post("/register", validation(joiRegisterSchema), ctrlWrapper(register));
router.post("/login", validation(joiLoginSchema), ctrlWrapper(login));
router.get("/current", user, ctrlWrapper(getCurrent));
router.post("/logout", user, ctrlWrapper(logout));
router.patch(
  "/",
  validation(joiSubscriptionSchema),
  ctrlWrapper(updateStatusUser)
);
router.patch(
  "/avatars",
  user,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

module.exports = router;
