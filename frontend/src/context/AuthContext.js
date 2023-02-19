import { createContext, useState, useEffect } from "react";
import BasePath from "../config/BasePath";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  let [loading, setLoading] = useState(true);

  const history = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    console.log("loginUser: ", e.target.username.value);
    let response = await fetch(BasePath + "/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      // get user info
      setUser(jwt_decode(data.access));

      localStorage.setItem("authTokens", JSON.stringify(data));
      history("/");
    } else {
      alert("Invalid Credentials");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    Navigate("/login");
  };

  let updateAuthTokens = async () => {
    let response = await fetch(BasePath + "/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens?.refresh,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    // only load for first rendering
    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateAuthTokens();
    }

    // update refresh token every 4 minutes
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateAuthTokens();
      }
    }, fourMinutes);
    return () => {
      clearInterval(interval);
    };
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
