import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import '../themes/login.css';


const SignUpPage = () => {
    let { signUpUser } = useContext(AuthContext);

    return (
        
        
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
                name="first_name"
                placeholder="Enter First Name"
                required
                />
                <input
                type="text"
                name="last_name"
                placeholder="Enter Last Name"
                required
                />
                <h4>Additional Information (optional)</h4>
                <input
                type="text"
                name="email"
                placeholder="Enter Email Address"
                />
                <input
                type="text"
                name="githubId"
                placeholder="Enter Github Username"

                />
                <button type="submit"> Sign Up </button>
            </form>

          </div>
      );
  };
  
  export default SignUpPage;