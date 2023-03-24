const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");
const { AppError } = require("../utils");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${req.user.id}-${uuid()}.${ext}`);
  },
  limits: {
    fileSize: 2048,
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Please upload images only..."), false);
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: multerFilter,
});

module.exports = {
  upload,
};
