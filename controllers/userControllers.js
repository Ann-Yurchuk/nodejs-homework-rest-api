const { Conflict, Unauthorized, AppError, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, joiSubscriptionSchema } = require("../models");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }
  const hasPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const result = await User.create({
    email,
    password: hasPassword,
  });
  res.status(201).json({ result });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized(`Email or password is wrong`);
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({ token });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.json({
    status: "seccess",
    code: 200,
    data: {
      user: {
        email,
      },
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({ message: "user logout!" });
};

const updateStatusUser = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  const { error } = joiSubscriptionSchema.validate({ subscription });

  if (error) {
    throw new AppError(400, "missing field subscription");
  }

  const result = await User.findByIdAndUpdate(id, { subscription }, { new: true });

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
};
