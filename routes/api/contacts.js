const express = require("express");
const { NotFound } = require("http-errors");
const Joi = require("joi");
const {
  getContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
} = require("../../controllers/contacts");
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContact(contactId);

    if (!result) {
      throw new NotFound(`Not found!`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = contactSchema.validate(body);

    if (error) {
      error.status = 400;
      throw error({ message: "missing required name field" });
    }
    const result = await addContact(body);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!contactId) {
      throw new NotFound(`Not found!`);
    }
    res.status(200).json({ result, message: "contact delete!" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    const { error } = contactSchema.validate(body);

    if (error) {
      error.status = 400;
      throw error({ message: "missing fields" });
    }

    const result = await updateContact(contactId, body);

    if (!result) {
      throw new NotFound(`Not found!`);
    }
    res.status(200).json({ result, message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
