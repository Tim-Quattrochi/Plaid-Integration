import { useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { authReducer, initialState } from "../context/AuthReducer";
import { handleDispatch } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(
    authReducer,
    initialState
  );
  const [checking, setIsChecking] = useState(true); //checking if user is authenticated for private route
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const handleRegister = async (userDetails) => {
    const { email, password } = userDetails;

    try {
      await registerUser(userDetails, authDispatch);

      //log the user in after successful registration

      await handleLogin(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await loginUser(email, password, authDispatch);

      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      logoutUser(authDispatch);
      navigate("/welcome");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDispatch(authDispatch, "SET_IS_SUBMITTING", true);

    if (isMounted) {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userPayload = {
            accessToken: auth.currentUser.accessToken,
            user: {
              id: auth.currentUser.uid,
              name: auth.currentUser.displayName,
              email: auth.currentUser.email,
            },
          };
          handleDispatch(authDispatch, "LOGIN", userPayload);
        }
        setIsChecking(false);
      });
    }

    handleDispatch(authDispatch, "SET_IS_SUBMITTING", false);

    return () => {
      isMounted.current = false;
    };
  }, [authDispatch, isMounted]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        authDispatch,
        handleRegister,
        handleLogin,
        handleLogout,
        checking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
