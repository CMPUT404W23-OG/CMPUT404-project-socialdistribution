import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// https://stackoverflow.com/questions/69864165/error-privateroute-is-not-a-route-component-all-component-children-of-rou
const PrivateRoute = ({ children, ...rest }) => {
  //   console.log("PrivateRoute: ", rest);
  let { user } = useContext(AuthContext);
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
