const superAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({
      message: "Access forbidden: You do not have super admin rights",
    });
  }
  next();
};

export { superAdmin };

