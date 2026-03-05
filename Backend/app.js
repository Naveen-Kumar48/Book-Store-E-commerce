const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const AppError = require("./utils/AppError");
const globalError = require("./middleware/globalError");

const bookRouter = require("./routers/bookRoute");
const userRouter = require("./routers/userRoute");
const orderRouter = require("./routers/orderRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
// load  with the application middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use((req, res, next) => {
//   console.log("I am middleware");
// console.log(req.headers);
//   next();
// });

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);

//how to handle the unknown routes
app.use("/{*any}/", (req, res, next) => {
  next(new AppError(`cannot found ${req.originalUrl} on the server `, 404));
});

// error handling middleware
app.use(globalError);

module.exports = app;

// morgan  --> third party middleware
