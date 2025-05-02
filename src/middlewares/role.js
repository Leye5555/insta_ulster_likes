module.exports = (roles) => (req, res, next) => {
  // only admins and super admins can create, edit and delete posts
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
