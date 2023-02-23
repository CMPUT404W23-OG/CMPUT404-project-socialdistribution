import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import '../themes/login.css';


const SignUpPage = () => {
    let { signUpUser } = useContext(AuthContext);

    return (
        
        
        <div className='signupForm'>
            <h1>Sign Up</h1>
            <form onSubmit={signUpUser}>
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
                <button type="submit"> Sign Up </button>
            </form>

          </div>
      );
  };
  
  export default SignUpPage;