const { joiSchema, favoriteSchema, Contact } = require("../models/contact");
const { NotFound } = require("http-errors");
const { AppError } = require("../utils");

const getAll = async (req, res) => {
  const result = await Contact.find({});
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const body = req.body;
  const { error } = joiSchema.validate(body);

  if (error) {
    throw new AppError(400, "missing required name field");
  }
  const result = await Contact.create(body);
  res.status(201).json({ result });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = joiSchema.validate(body);

  if (error) {
    throw new AppError(400, "missing fields");
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result, message: "contact updated" });
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { error } = favoriteSchema.validate({ favorite });

  if (error) {
    throw new AppError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result });
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);

  if (!contactId) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result, message: "contact delete!" });
};

module.exports = {
  getAll,
  getById,
  add,
  updateById,
  updateStatusContact,
  removeById,
};
