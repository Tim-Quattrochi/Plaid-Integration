const express = require("express");
const {
  signup,
  login,
  logout,
  refresh,
  list,
} = require("../controllers/auth.controller");
const VerifyJWT = require("../middleware/VerifyJWT");
const validateReqBody = require("../middleware/validateReqBody");
const rateLimiter = require("../middleware/rateLimiter");
const userRouter = express.Router();

//these routes are currently not being used since firebase user auth is client side.
userRouter.post(
  "/register",
  validateReqBody("email", "password", "confirmPassword", "name"),
  signup
);
userRouter.post(
  "/login",
  rateLimiter,
  validateReqBody("email", "password"),
  login
);

userRouter.post("/logout", logout);

userRouter.get("/refresh", refresh);

/**
 * This is just a test route to test protected resources via the VerifyJWT middleware.
 */
userRouter.get("/list", VerifyJWT, list);

module.exports = userRouter;
