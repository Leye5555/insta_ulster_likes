module.exports = (roles) => (req, res, next) => {
  // string of roles ['admin', 'user']
  // stop users without appropriate role
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  // stop users from updating other users
  if (req.user.role === "user" && req.params.id !== req.user._id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
