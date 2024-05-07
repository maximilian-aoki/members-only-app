const express = require("express");
const router = express.Router();

// home (anyone)
router.get("/", (req, res, next) => {
  res.send("home page");
});

// sign-up (anyone)
router.get("/sign-up", (req, res, next) => {
  res.send("sign-up page");
});

// log-in (anyone)
router.get("/log-in", (req, res, next) => {
  res.send("home page");
});

// view all messages (anyone, visitor, member, admin)
router.get("/messages", (req, res, next) => {
  res.send("all messages");
});

// create new message (member, admin)
router.get("/messages/create", (req, res, next) => {
  res.send("create new message form");
});

// user profile (visitor, member, admin)
router.get("/users/:id", (req, res, next) => {
  res.send("user profile page");
});

module.exports = router;
