const { Conflict, Unauthorized, AppError, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models");
const { joiSubscriptionSchema } = require("../utils");

const { SECRET_KEY, PORT } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const tempDir = path.join(__dirname, "../", "tmp");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }
  const avatarURL = gravatar.url(email);
  const hasPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const result = await User.create({
    email,
    password: hasPassword,
    avatarURL,
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "72h" });
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

  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result });
};

const updateAvatar = async (req, res) => {
  const { uniqueFileName } = req;
  const tempFile = path.resolve(tempDir, uniqueFileName);
  try {
    const resultUpload = path.join(avatarsDir, uniqueFileName);
    const img = await Jimp.read(tempFile);
    img.resize = await img.resize(250, 250, Jimp.AUTO);
    await img.writeAsync(resultUpload);
    await fs.unlink(tempFile);
    const avatarURL = "http://localhost:" + PORT + "/avatars/" + uniqueFileName;
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempFile);
    throw error;
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
};
