const { body } = require("express-validator");

const validator = {};

// user validators
validator.validateFirstName = body("firstName")
  .trim()
  .notEmpty()
  .withMessage("must provide first name")
  .isLength({ max: 15 })
  .withMessage("first name cannot exceed 15 chars")
  .escape();
validator.validateLastName = body("lastName").optional().trim().escape();
validator.validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("must provide email")
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage("email must be in valid format");
validator.validatePassword = body("password")
  .notEmpty()
  .withMessage("must provide password")
  .isLength({ min: 6, max: 20 })
  .withMessage("password must be between 6 and 20 chars")
  .custom((value, { req }) => {
    return value === req.body.passwordConfirm;
  })
  .withMessage("password must match the 'confirm password' field")
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
