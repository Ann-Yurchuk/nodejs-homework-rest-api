const path = require("path");
const fse = require("fs-extra");
const jimp = require("jimp");
const multer = require("multer");
const uuid = require("uuid").v4;
const { AppError } = require("../utils");

class ImageService {
  static upload(name) {
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(new AppError(400, "Please upload images only..."), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, options, ...pathSegments) {
    const fileName = `${uuid().jpeg}`;
    const fullFilePath = path.join(process.cwd(), "temp", ...pathSegments);
    await fse.ensureDir(fullFilePath);
    const img = await jimp.read(file.buffer);
    await img
      .autocrop()
      .cover(
        options ||
          (250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE)
      )
      .writeAsync(fileName);
  }
}
