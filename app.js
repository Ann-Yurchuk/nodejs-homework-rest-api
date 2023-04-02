const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const { notFound, globalError } = require("./middlewares");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const contactsRouter = require("./routes/api/contactsRoute");
const userRouter = require("./routes/api/userRoute");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);
app.use(notFound);
app.use(globalError);

module.exports = app;
