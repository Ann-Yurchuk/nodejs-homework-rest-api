const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const [filename, extension] = file.originalname.split(".");
    const uniqueFileName = `${filename}_${uuid()}.${extension}`;
    req.uniqueFileName = uniqueFileName;
    cb(null, `${uniqueFileName}`);
  },
  limits: {
    fileSize: 2000000,
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
};
