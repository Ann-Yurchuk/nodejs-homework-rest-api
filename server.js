const mongoose = require("mongoose");
const app = require("./app");

// const path = require("path");
// const fs = require("fs").promises;

// const tempDir = path.join(process.cwd(), "avatars");
// const storeImage = path.join(process.cwd(), "images");

const { DB_HOST, PORT } = process.env;

// const isAccessible = (path) => {
//   return fs
//     .access(path)
//     .then(() => true)
//     .catch(() => false);
// };

// const createFolderIsNotExist = async (folder) => {
//   if (!(await isAccessible(folder))) {
//     await fs.mkdir(folder);
//   }
// };

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      // createFolderIsNotExist(tempDir);
      // createFolderIsNotExist(storeImage);
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
