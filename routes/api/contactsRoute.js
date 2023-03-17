const express = require("express");
const {
  getAll,
  getById,
  add,
  updateById,
  updateStatusContact,
  removeById,
} = require("../../controllers/contactsControllers");
const { validation, user } = require("../../middlewares");
const { ctrlWrapper } = require("../../utils");
const { joiSchema, favoriteSchema } = require("../../models/contact");

const router = express.Router();

router
  .route("/")
  .get(user, ctrlWrapper(getAll))
  .post(user, validation(joiSchema), ctrlWrapper(add));

router
  .route("/:contactId")
  .get(ctrlWrapper(getById))
  .put(validation(joiSchema), ctrlWrapper(updateById))
  .patch(validation(favoriteSchema), ctrlWrapper(updateStatusContact))
  .delete(ctrlWrapper(removeById));

module.exports = router;
