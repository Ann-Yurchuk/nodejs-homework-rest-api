const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");
const { User } = require("../models");
const { SECRET_KEY } = process.env;

const user = async (req, res, next) => {
  const { autorization = "" } = req.headers;
  const [bearer, token] = autorization.split(" ");
  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw new Unauthorized("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid sugnature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = {
  user,
};
