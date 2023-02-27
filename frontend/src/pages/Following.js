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

const Following = () => {
  const { user } = useContext(AuthContext);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetch(BasePath + "/following/" + user.email + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowing(data);
      })
      .catch((err) => console.log(err));
  }, [user.email]);

  const handleDelete = async (id) => {
    // Filter out the deleted follower
    const updatedFollowing = following.filter(
      (following) => following.id !== id
    );

    // Update the state
    setFollowing(updatedFollowing);
    try {
      const response = fetch(BasePath + "/follow/" + id + "/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if ((await response).status === 204) {
        console.log("Deleted!");
      } else {
        console.log("Failed to delete!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3
        style={{
          textAlign: "center",
          fontStyle: "italic",
          fontFamily: "serif",
        }}
      >
        Following
      </h3>
      <List
        sx={{
          width: "60%",

          position: "relative",
          overflow: "auto",
          margin: "auto",
        }}
      >
        {following.map((following) => (
          <ListItem
            key={following.id}
            disableGutters
            sx={{
              // marginBottom: "10px",
              "&:hover": {
                bgcolor: "grey.200",
              },
              border: "1px solid grey",
              borderRadius: "2px",
              marginBottom: "0.2em",
              bgcolor: "background.paper",
            }}
            secondaryAction={
              <IconButton
                sx={{ "&:hover": { color: "red" } }}
                aria-label="comment"
                onClick={() => handleDelete(following.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Avatar
              sx={{
                bgcolor: "blue",
                marginLeft: "0.5em",
                marginRight: "0.5em",
              }}
              alt={following.following.username}
            >
              {following.following.username.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText primary={following.following.username} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Following;
