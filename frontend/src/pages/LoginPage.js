import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import '../themes/login.css';

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div className='loginForm'>
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
        <Link to="/signup"><button className="signupbtn">Sign up</button></Link>
        <p>Don't have an account, Please wait for signup page </p>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default LoginPage;
