const express = require("express");
const router = express.Router();
const User = require("../db/models/user");
const Message = require("../db/models/message");

const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const vd = require("../middleware/validator");
const auth = require("../middleware/authenticator");

// home (anyone) - GET
router.get("/", (req, res, next) => {
  res.render("index", {
    header: "Home Page",
  });
});

// sign-up (anyone) - GET, POST
router
  .route("/sign-up")
  .get((req, res, next) => {
    res.render("sign-up", {
      header: "Sign Up!",
    });
  })
  .post([
    vd.pipe([
      vd.validateFirstName,
      vd.validateLastName,
      vd.validateEmail,
      vd.validatePassword,
      vd.validateMembershipStatus,
    ]),
    asyncHandler(async (req, res, next) => {
      console.log(req.body);
      const errors = validationResult(req);
      if (errors.errors.length) {
        const allErrors = errors.array().map((error) => error.msg);
        return res.render("sign-up", {
          header: "Sign Up!",
          errors: allErrors,
          postVals: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
          },
        });
      }

      const validatedData = matchedData(req);
      const bcryptPassword = await bcrypt.hash(validatedData.password, 10);
      await User.create({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: bcryptPassword,
        membershipStatus: "visitor",
      });
      res.redirect("/log-in");
    }),
  ]);

// log-in (anyone) - GET, POST
router
  .route("/log-in")
  .get((req, res, next) => {
    res.render("log-in", {
      header: "Log In",
    });
  })
  .post([
    vd.pipe([vd.validateEmail, vd.validatePassword]),
    (req, res, next) => {
      res.send("post to log-in");
    },
  ]);

// log-out (visitor, member, admin) - GET
router.get("/log-out", [
  auth.baseAuthentication,
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/");
    });
  },
]);

// view all messages (visitor, member, admin) - GET
router.get("/messages", [
  auth.baseAuthentication,
  (req, res, next) => {
    res.render("messages", {
      header: "All Messages",
    });
  },
]);

// create new message (member, admin) - GET, POST
router
  .route("/messages/create")
  .get([
    auth.memberAuthentication,
    (req, res, next) => {
      res.get("message-create", {
        header: "Create a Message!",
      });
    },
  ])
  .post([
    auth.memberAuthentication,
    vd.pipe([vd.validateTitle, vd.validateText]),
    (req, res, next) => {
      res.send("post new message");
    },
  ]);

// user profile (visitor, member, admin) - GET, POST
router
  .route("/users/:id")
  .get([
    auth.baseAuthentication,
    (req, res, next) => {
      res.render("profile", {
        header: `User Profile: ${res.locals.currentUser.fullName}`,
      });
    },
  ])
  .post([
    auth.baseAuthentication,
    (req, res, next) => {
      res.send("post user profile change");
    },
  ]);

module.exports = router;
