import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const Header = () => {
  //   console.log(AuthContext);
  let { user, logoutUser } = useContext(AuthContext);

  //   console.log(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      {user ? (
        <button onClick={logoutUser}> Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}

      {user && <p>Hello {user.username}</p>}
    </div>
  );
};
export default Header;
