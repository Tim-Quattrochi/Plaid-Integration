const {
  createAccessToken,
  createRefreshToken,
} = require("../config/createToken");
const createCookie = require("../config/createCookie");
const { db, auth } = require("../config/db");
const jwt = require("jsonwebtoken");
const {
  REFRESH_TOKEN_SECRET,
  APP_NAME,
} = require("../config/constants");
const CustomError = require("../utils/errorClass");

//this file is currently not being used because user signup/login is client side.

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await auth
      .createUser({
        email: email,
        password: password,
        refreshToken: null,
        disabled: false,
      })

      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.uid);
        const payload = {
          id: userRecord.uid,
          email: userRecord.email,
        };
        const accessToken = createAccessToken(payload);

        return res
          .status(200)
          .json({ ...userRecord, accessToken: accessToken });
      });
    auth.s;
  } catch (error) {
    next(error);
  }
};

async function createOrRetrieveUser(uid, userData) {
  const userRef = db.collection("users").doc(uid);

  const userDock = await userRef.get();

  if (!userDock.exists) {
    await userRef.set(userData);
  }
  return userRef;
}

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new CustomError("Invalid email or password.", 400));
  }

  try {
    const user = await auth
      .createUser({
        email: email,
        password: password,
        refreshToken: null,
        disabled: false,
      })
      .then(async (userRecord) => {
        console.log("Successfully created new user:", userRecord);
        await functions.auth.user().onCreate((user) => {
          user.displayName = name;
          console.log(user);
        });

        const payload = {
          id: userRecord.uid,
          name: userRecord.name,
          email: userRecord.email,
        };
        const refreshToken = createRefreshToken(payload);
        const userData = {
          uid: userRecord.uid,
          name: name,
          email: email,
          refreshToken: refreshToken,
        };

        createCookie(refreshToken, res);
        const userRef = await createOrRetrieveUser(
          userRecord.uid,
          userData
        );

        const accessToken = createAccessToken(payload);

        return res
          .status(200)
          .json({ payload, accessToken: accessToken });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies[APP_NAME]) {
      return next(
        new CustomError("Refresh Token not found in cookies.", 401)
      );
    }

    const refreshToken = cookies[APP_NAME];
    let user; //find the user by their current refresh token.

    if (!user) {
      return next(new CustomError("Forbidden.", 403));
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || user.email !== decoded.email) {
        return res.sendStatus(403); //forbidden
      }
    });

    const payload = { id: user._id, email: user.email };
    const accessToken = createAccessToken(payload);

    return res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = (req, res, next) => {
  const cookies = req.cookies;
  try {
    if (!cookies[APP_NAME]) {
      return next(new CustomError("No cookies to clear.", 200));
    }

    res.clearCookie(APP_NAME, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return next(new CustomError("Cookies Cleared.", 200));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = (req, res, next) => {};

/**
 * This is just a test endpoint because it is protected with VerifyJWT middleware.
 * @param {*} req the request
 * @param {*} res  the response
 * @param {*} next  the next fn that passes to the next chain
 * @returns {Object} returns a list of numbers
 */
const list = async (req, res, next) => {
  console.log(req.user);
  try {
    res.status(200).json({ list: [1, 2, 3, 4, 5] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { signup, login, refresh, list, logout };
