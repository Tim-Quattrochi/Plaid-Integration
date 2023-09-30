const jwt = require("jsonwebtoken");
const { auth } = require("../config/db");
const { ACCESS_TOKEN_SECRET } = require("../config/constants");

const verifyJWT = async (req, res, next) => {
  const authHeader =
    req.headers.authorization || req.headers.Authorization; //It's not a bad idea to check for capitalization.

  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ error: "Not Authorized." });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    auth.verifyIdToken(accessToken).then((user) => {
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Forbidden." });
  }
};

module.exports = verifyJWT;
