const multer = require("multer"); 
const uuid = require("uuid").v4;
const path = require("path");
const { AppError } = require("../utils");

const tempDir = path.join(__dirname, "../", "tmp");

console.log(tempDir);

// 
// const multerConfig = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `${req.user.id}-${uuid()}.${ext}`);
//   },
//   limits: {
//     fileSize: 2000000,
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//     return;
//   }
//   cb(new AppError(400, "Please upload images only..."), false);
// };

// const upload = multer({
//   storage: multerConfig,
//   fileFilter: multerFilter,
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir)
    },
    filename: (req, file, cb) => {
        const [filename, extension] = file.originalname.split('.');
        const uniqueFileName = `${filename}_${uuid()}.${extension}`;
        req.uniqueFileName = uniqueFileName;
        cb(null, `${uniqueFileName}`)
    }
});

const upload = multer({storage});


module.exports = {
  upload,
};
