const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { notFound, globalError } = require("./middlewares");

const contactsRouter = require("./routes/api/contactsRoute");
const userRouter = require("./routes/api/userRoute");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/contacts", contactsRouter);
app.use(notFound);
app.use(globalError);

module.exports = app;
