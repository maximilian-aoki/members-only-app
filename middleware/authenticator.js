const authMiddleware = {};

authMiddleware.setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

authMiddleware.baseAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
};

authMiddleware.advancedAuthentication = (req, res, next, redirectUrl) => {
  if (
    res.locals.currentUser.membershipStatus === "member" ||
    res.locals.currentUser.membershipStatus === "admin"
  ) {
    return next();
  }
  res.redirect(redirectUrl);
};

module.exports = authMiddleware;
