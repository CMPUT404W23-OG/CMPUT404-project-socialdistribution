import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import '../themes/login.css';
import { Box, Container } from "@mui/material";

const SignUpPage = () => {
    let { signUpUser } = useContext(AuthContext);

    return (
        <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Container maxWidth="md">
        
        <div className='signupForm'>
            <h1>Sign Up for Social Distribution</h1>
            <form onSubmit={signUpUser}>
                <h4>Required Information</h4>
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
                <input
                type="text"
                name="githubId"
                placeholder="Enter Github Username"
                />
                <button type="submit"> Sign Up </button>
            </form>

          </div>
            </Container>
            </Box>
      );
  };
  
  export default SignUpPage;