import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../themes/header.css';
const Header = () => {
  //   console.log(AuthContext);
  let { user, logoutUser } = useContext(AuthContext);

  //   console.log(AuthContext);

  return (
    <div className='header'>
      <nav className='navbar'>
        <ul>
          <li><Link to="/"><button>Home</button></Link></li>
          {/* <span> | </span> */}
          <li>
              {user ? (
              <button onClick={logoutUser}> Logout</button>
            ) : (
              <Link to="/login"><button>Login</button></Link>
            )}
          </li>
          {user && <p>Hello {user.username}</p>}
        </ul>
      </nav>
    </div>
  );
};
export default Header;
