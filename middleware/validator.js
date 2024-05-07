const { body } = require("express-validator");

const validator = {};

// user validators
validator.validateFirstName = body("firstName")
  .trim()
  .notEmpty()
  .isLength({ max: 15 })
  .escape();
validator.validateLastName = body("lastName")
  .trim()
  .isLength({ max: 15 })
  .escape();
validator.validateEmail = body("email")
  .trim()
  .notEmpty()
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
validator.validatePassword = body("password")
  .notEmpty()
  .isLength({ min: 6, max: 20 })
  .custom((value, { req }) => {
    return value === req.body.passwordConfirm;
  })
  .escape();
validator.validateMembershipStatus = body("membershipStatus")
  .optional()
  .isIn(["visitor", "member", "admin"]);

// message validators
validator.validateTitle = body("title").trim().notEmpty().isLength({ max: 30 });
validator.validateText = body("text").trim().notEmpty().isLength({ max: 200 });

// validator pipe middleware
validator.pipe = (validators) => {
  return async (req, res, next) => {
    for (let i = 0; i < validators.length; i += 1) {
      await validators[i].run(req);
    }
    next();
  };
};
// export
module.exports = validator;
