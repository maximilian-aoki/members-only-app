const express = require("express");
const router = express.Router();

const User = require("../db/models/user");
const Message = require("../db/models/message");

const asyncHandler = require("express-async-handler");

// home (anyone) - GET
router.get("/", (req, res, next) => {
  res.send("home page");
});

// sign-up (anyone) - GET, POST
router
  .route("/sign-up")
  .get((req, res, next) => {
    res.send("get sign-up page");
  })
  .post((req, res, next) => {
    res.send("post to sign-up");
  });

// log-in (anyone) - GET, POST
router
  .route("/log-in")
  .get((req, res, next) => {
    res.send("get log-in page");
  })
  .post((req, res, next) => {
    res.send("post to log-in");
  });

// log-out (visitor, member, admin) - POST
router.post("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

// view all messages (anyone, visitor, member, admin) - GET
router.get("/messages", async (req, res, next) => {
  res.send("all messages");
});

// create new message (member, admin) - GET, POST
router
  .route("/messages/create")
  .get((req, res, next) => {
    res.send("get new message form");
  })
  .post((req, res, next) => {
    res.send("post new message");
  });

// user profile (visitor, member, admin) - GET, POST
router
  .route("/users/:id")
  .get((req, res, next) => {
    res.send("get user profile page");
  })
  .post((req, res, next) => {
    res.send("post user profile change");
  });

module.exports = router;
