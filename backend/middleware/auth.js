const userDb = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Please Login to access this resource" });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userDb.findById(decodedData.id);
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role: ${req.user.role} is not allowed to access this resource `,
      });
    }
    next();
  };
};

/*// Query parsing middleware
const parseQuery = (req, res, next) => {
  req.query.productId = req.query.productId || req.query.id; // Handle both 'productId' and 'id' as query parameters
  next();
};*/

module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
  //parseQuery,
};
