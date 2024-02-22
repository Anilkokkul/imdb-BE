const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const cookies = req.cookies;
  if (cookies.accessToken) {
    const obj = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    if (!obj._id) {
      return res.status(401).send({ message: "Failed to authenticate" });
    }
    return next();
  }
  return res.status(401).send({ message: "Failed to authenticate" });
};
