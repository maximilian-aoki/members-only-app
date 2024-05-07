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

authMiddleware.memberAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      res.locals.currentUser.membershipStatus === "member" ||
      res.locals.currentUser.membershipStatus === "admin"
    ) {
      return next();
    }
  }
  res.redirect("/log-in");
};

authMiddleware.adminAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (res.locals.currentUser.membershipStatus === "admin") {
      return next();
    }
  }
  res.redirect("/log-in");
};

module.exports = authMiddleware;
