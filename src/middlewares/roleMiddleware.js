const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};
module.exports = roleMiddleware;
