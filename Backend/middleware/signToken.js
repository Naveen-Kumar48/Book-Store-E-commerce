const jwt = require("jsonwebtoken");

exports.signToken = (id) => {
  // console.log("haii", id);
  return jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
