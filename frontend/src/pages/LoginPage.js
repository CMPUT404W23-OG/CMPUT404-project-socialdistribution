import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div>
        <form onSubmit={loginUser}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            required
          />
          <button type="submit"> Login </button>
        </form>

        <p>Don't have an account, Please wait for signup page </p>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default LoginPage;
