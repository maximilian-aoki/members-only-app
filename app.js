require("dotenv").config();
// express generator imports
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// authentication imports
const session = require("express-session");
const passport = require("./passport");
const MongoStore = require("connect-mongo");

// database imports
const connectMongo = require("./db/mongoose");

// custom routers
const indexRouter = require("./routes/index");

const app = express();
connectMongo();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// passport initialization
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_DEV_URI,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
