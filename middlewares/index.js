const { validation } = require("./validation");
const { ctrlWrapper } = require("./ctrlWrapper");
const { notFound } = require("./notFound");
const { globalError } = require("./globalError");

module.exports = {
  validation,
  ctrlWrapper,
  notFound,
  globalError,
};
