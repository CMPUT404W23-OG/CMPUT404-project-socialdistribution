import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import "../themes/login.css";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Container maxWidth="md">
          <div className="loginForm">
            <h1>Welcome to Social Distribution!</h1>
            <h2>Create an account or login.</h2>
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
            <h3> OR </h3>
            <Link to="/signup">
              <button className="signupbtn">Sign up</button>
            </Link>
            <p>Don't have an account, Please Sign Up! </p>
          </div>
        </Container>
      </Box>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default LoginPage;
