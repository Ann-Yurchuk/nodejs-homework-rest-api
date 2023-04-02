const { Conflict, Unauthorized, AppError, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models");
const { joiSubscriptionSchema } = require("../utils");
const { sendEmail } = require("../helpers");
const { notFound } = require("../middlewares");

const { SECRET_KEY, PORT, EMAIL_FROM } = process.env;

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
  const verificationToken = uuid();
  const result = await User.create({
    email,
    password: hasPassword,
    avatarURL,
    verificationToken,
  });

  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: "Please verificate.",
    text: "please open in browser, that support html messages view",
    html:
      "<h3>Please complete registration: confirm you email </h3>" +
      `<h4>
          <a href='http://localhost:3000/api/users/verify/${verificationToken}'>
            by click on this link
          </a>
        </h4>`,
  };
  await sendEmail(msg);

  res.status(201).json({ result });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, verify: true });
  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized(
      `Email is wrong or not verify, or password is wrong`
    );
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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw notFound();
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verification successful" });
};

const verifyUserControler = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }
  const user = await User.findOne({ email });
  if (user.verify) {
    res.status(400).json({ message: "Verification has already been passed" });
  }

  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: "Verification email (dublicate)",
    text: "please open in browser, that support html messages view",
    html:
      "<h3>Please complete registration: confirm you email </h3>" +
      `<h4>
          <a href='http://localhost:3000/api/users/verify/${user.verificationToken}'>
            by click on this link
          </a>
        </h4>`,
  };

  await sendEmail(msg);
  res.status(200).json({ message: "Verification email is resented" });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
  verifyEmail,
  verifyUserControler,
};
