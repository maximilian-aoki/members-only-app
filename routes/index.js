require("dotenv").config();
const express = require("express");
const router = express.Router();

const User = require("../db/models/user");
const Message = require("../db/models/message");

const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const vd = require("../middleware/validator");
const auth = require("../middleware/authenticator");
const passport = require("../passport");
const { locals } = require("../app");

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
    passport.authenticate("local", {
      successRedirect: "/messages",
      failureRedirect: "/log-in",
    }),
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

// delete message (admin) - POST
router.post("/messages/:id/delete-message", [
  auth.adminAuthentication,
  asyncHandler(async (req, res, next) => {
    res.redirect("/messages");
  }),
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
    vd.pipe([vd.validateMembershipStatus]),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (errors.errors.length) {
        const allErrors = errors.array().map((error) => error.msg);
        return res.render("profile", {
          header: `User Profile: ${res.locals.currentUser.fullName}`,
          errors: allErrors,
        });
      }

      const validatedData = matchedData(req);
      let message = "no change to membership status";
      if (
        validatedData.membershipStatus === "visitor" &&
        res.locals.currentUser.membershipStatus !== "visitor"
      ) {
        const user = await User.findById(res.locals.currentUser.id);
        user.membershipStatus = "visitor";
        await user.save();
        res.locals.currentUser = user;
        message = "successful membership change";
      } else if (
        validatedData.membershipStatus === "member" &&
        res.locals.currentUser.membershipStatus !== "member"
      ) {
        if (req.body.membershipPassword === process.env.MEMBER_PASSWORD) {
          const user = await User.findById(res.locals.currentUser.id);
          user.membershipStatus = "member";
          await user.save();
          res.locals.currentUser = user;
          message = "successful membership change";
        } else {
          message = "wrong password!";
        }
      } else if (
        validatedData.membershipStatus === "admin" &&
        res.locals.currentUser.membershipStatus !== "admin"
      ) {
        if (req.body.membershipPassword === process.env.ADMIN_PASSWORD) {
          const user = await User.findById(res.locals.currentUser.id);
          user.membershipStatus = "admin";
          await user.save();
          res.locals.currentUser = user;
          message = "successful membership change";
        } else {
          message = "wrong password!";
        }
      }

      res.render("profile", {
        header: `User Profile: ${res.locals.currentUser.fullName}`,
        message,
      });
    }),
  ]);

module.exports = router;
