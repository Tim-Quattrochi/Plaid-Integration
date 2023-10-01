import { handleDispatch } from "../utils/authUtils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { APP_NAME } from "../config/constants";

/**
 *
 * @param {Object} userDetails - the user details to be used for registration.
 * @param {Function} authDispatch -the dispatch function from the authReducer to update the state.
 * @returns {Promise<void>} - A promise that resolves when the registration is successful and the user is logged in.
 * @throws {Error} - If the registration fails or there is an error during the process.
 *  * @example
 * const userDetails = { name: "John Doe", email: "john@example.com", password: "secretpassword" };
 * used in AuthProvider.
 * await registerUser(userDetails, authDispatch);
 */
const registerUser = async (userDetails, authDispatch) => {
  handleDispatch(authDispatch, "SET_IS_SUBMITTING", true);

  const { email, confirmPassword, name } = userDetails;
  try {
    const userCreds = await createUserWithEmailAndPassword(
      auth,
      email,
      confirmPassword
    );

    updateProfile(auth.currentUser, {
      displayName: name,
    });

    //points to the google users uid.
    const userId = userCreds.user.uid;

    //user data to store in Cloud FireStore.
    const userData = {
      name: name,
      email: email,
      timestamp: serverTimestamp(),
    };
    //update the user collection in the firestore if it does not exist.
    await setDoc(doc(firestore, "users", userId), userData);
  } catch (error) {
    handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);
    //if there is an error from google, show the error.code which
    //displays a more non-tech reason for the error.
    if (error) {
      handleDispatch(authDispatch, "SET_ERROR", error.code);
      throw new Error(error.code);
    } else {
      throw error;
    }
  }
};

/**
 *
 * @param {string} email - email value from user login input.
 * @param {string} password - password value from user login input.
 * @param {Function} authDispatch  -the dispatch function from the authReducer to update the state.
 *
 * * @example
 * email: "john@example.com", password: "secretpassword" };
 * used in AuthProvider.
 * await loginUser(userEmail,password, authDispatch);
 */
const loginUser = async (userEmail, password, authDispatch) => {
  handleDispatch(authDispatch, "SET_IS_SUBMITTING", true);
  handleDispatch(authDispatch, "SET_ERROR", null); //clear any errors in state.
  try {
    await signInWithEmailAndPassword(auth, userEmail, password).then(
      (res) => {
        const {
          user: { accessToken, uid, email, displayName },
        } = res;
        const userInfo = { uid, email, displayName };
        //if there is a user, save user info in state
        if (res.user) {
          handleDispatch(authDispatch, "LOGIN", {
            user: userInfo,
            accessToken,
          });

          handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);
        }
      }
    );
  } catch (error) {
    handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);

    //turns the error message user friendly and readable.
    let errorMsg;
    if (error.code === "auth/invalid-login-credentials") {
      errorMsg = "Invalid username or password.";
    } else {
      errorMsg = error;
    }

    if (error || error.code) {
      handleDispatch(authDispatch, "SET_ERROR", errorMsg);
      throw new Error(errorMsg);
    } else {
      throw error;
    }
  }
};

/**
 *
 * @param {Function} authDispatch - The dispatch function from the authReducer to update the state.
 * @returns {void}
 */
const logoutUser = async (authDispatch) => {
  handleDispatch(authDispatch, "SET_IS_SUBMITTING", true);

  const authProv = getAuth();
  try {
    signOut(authProv).then(() => {
      localStorage.removeItem(`${APP_NAME}`);
      handleDispatch(authDispatch, "LOGOUT", null);
      handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);
    });
  } catch (error) {
    handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);
    if (error.response || error.response) {
      handleDispatch(
        authDispatch,
        "SET_ERROR",
        error.response.data.error
      );
    }
    console.log(error);
  }
};

export { registerUser, loginUser, logoutUser };
