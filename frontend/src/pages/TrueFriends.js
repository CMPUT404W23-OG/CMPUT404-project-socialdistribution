import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
// import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";

import IconButton from "@mui/material/IconButton";
import BasePath from "../config/BasePath";
import { fontStyle, style } from "@mui/system";

const TrueFriends = () => {
  const { user } = useContext(AuthContext);
  const [trueFriends, setTrueFriends] = useState([]);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${authTokens.access}`,
  };

  useEffect(() => {
    fetch(BasePath + "/friends/" + user.user_id + "/", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTrueFriends(data);
      })
      .catch((err) => console.log(err));
  }, [user.email]);

  return (
    <div>
      <h3
        style={{
          textAlign: "center",
          marginTop: "4em",
        }}
      >
        True Friends
      </h3>
      <List
        sx={{
          width: "60%",

          position: "relative",
          overflow: "auto",
          margin: "auto",
        }}
      >
        {trueFriends.map((trueFriends) => (
          <ListItem
            key={trueFriends.id}
            disableGutters
            sx={{
              // marginBottom: "10px",
              "&:hover": {
                bgcolor: "grey.200",
              },
              border: "1px solid grey",
              borderRadius: "1em",
              marginBottom: "0.5em",
              bgcolor: "background.paper",
              height: "5em",
            }}
          >
            <Avatar
              src={trueFriends.follower.profile_image_url}
              sx={{
                bgcolor: "blue",
                marginLeft: "0.5em",
                marginRight: "0.5em",
                height: "3em",
                width: "3em",
              }}
              alt={trueFriends.follower.username}
            ></Avatar>
            <ListItemText primary={trueFriends.follower.username} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TrueFriends;
