const { validation } = require("./validation");
const { notFound } = require("./notFound");
const { globalError } = require("./globalError");
const { user } = require("./user");

module.exports = {
  validation,
  notFound,
  globalError,
  user,
};
