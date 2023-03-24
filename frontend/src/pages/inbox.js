import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BasePath from "../config/BasePath";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  CardMedia,
  Card,
} from "@mui/material";

export default function Inbox() {
  let { user, logoutUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const postRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        fetch(BasePath + "/requests_received/" + user.user_id + "/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
        fetch(BasePath + "/following/" + user.user_id + "/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
      ])
        .then(([requestsResponse, followingResponse]) =>
          Promise.all([requestsResponse.json(), followingResponse.json()])
        )
        .then(([requestsData, followingData]) => {
          console.log("populateRequests: ", requestsData);
          setRequests(requestsData);
          console.log(followingData);
          setFollowing(followingData);
          console.log("Testing following ", followingData);
          if (followingData) {
            const followingPostListPromises = followingData.map((following) =>
              fetch(
                BasePath +
                  "/posts/author/" +
                  JSON.stringify(following.following.id),
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                }
              ).then((res) => res.json())
            );
            Promise.all(followingPostListPromises).then((followingPostList) => {
              console.log("Following post list: ", followingPostList);

              console.log("Posts: ", followingPostList);
              let listOfPosts = [];
              for (let i = 0; i < followingPostList.length; i++) {
                for (let j = 0; j < followingPostList[i].length; j++) {
                  listOfPosts.push(followingPostList[i][j]);
                }
              }
              listOfPosts.sort((a, b) => {
                return new Date(b.datePublished) - new Date(a.datePublished);
              });
              console.log("List of posts: ", listOfPosts);
              setPosts(listOfPosts);
            });
          }
        })
        .catch((error) => console.log(error));
    };

    // fetch data and update state initially
    fetchData();
    // fetch data and update state every 10 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDelete = async (id) => {
    const newRequests = requests.filter((request) => request.id !== id);
    setRequests(newRequests);

    try {
      const response = fetch(BasePath + "/request/" + id + "/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if ((await response.status) === 204) {
        console.log("Deleted");
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (id) => {
    const newRequests = requests.filter((request) => request.id !== id);
    setRequests(newRequests);

    try {
      const response = fetch(BasePath + "/request/" + id + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Approve: true,
          Cancel: false,
        }),
      });
      if ((await response).ok === true) {
        console.log("Accepted");
        console.log("Response: ", response);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="md">
      <div>
        <Typography variant="h5" style={{ marginTop: "5rem" }}>
          Follow Requests
        </Typography>
        <List style={{ maxHeight: "30vh", overflowY: "scroll" }}>
          {requests.map((request) => (
            <ListItem
              key={request.id}
              disableGutters
              sx={{
                bgcolor: "background.paper",
                borderRadius: "0.5em",
                boxShadow: 1,
                marginTop: "0.5em",
              }}
            >
              <ListItemAvatar>
                <Avatar alt="Profile Picture" sx={{ marginLeft: "0.5em" }}>
                  {request.follower.username.charAt(0).toUpperCase()
                    ? request.follower.username.charAt(0).toUpperCase()
                    : "Unkonwn"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={
                  request.follower.username + " has sent you a follow request."
                }
              />

              <Button
                variant="contained"
                sx={{ bgcolor: "green" }}
                onClick={() => handleAccept(request.id)}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  marginLeft: "0.5em",
                  marginRight: "0.5em",
                  bgcolor: "red",
                }}
                onClick={() => handleDelete(request.id)}
              >
                Decline
              </Button>
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" sx={{ marginTop: "1em" }}>
          Posts
        </Typography>
        <List>
          {posts.map((post) => (
            <Link
              key={post.id}
              to="/"
              state={post.id}
              style={{ textDecoration: "none" }}
            >
              <ListItem
                key={post.id}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "1em",
                  boxShadow: 1,
                  marginTop: "0.5em",
                }}
              >
                <ListItemAvatar>
                  <Avatar alt="Profile Picture">
                    {post.author_name
                      ? post.author_name.charAt(0).toUpperCase()
                      : "Unkonwn"}
                  </Avatar>
                  <ListItemText primary={post.author_name} />
                </ListItemAvatar>

                <ListItemText
                  primary={post.title}
                  secondary={post.body}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline",
                    marginLeft: "1em",
                    textAlign: "center",
                  }}
                />

                {post.image_file || post.image_url ? (
                  <Card>
                    <CardMedia
                      component="img"
                      height="150"
                      image={
                        post.image_url
                          ? post.image_url
                          : BasePath + post.image_file
                      }
                      alt="Post image"
                    />
                  </Card>
                ) : null}
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </Container>
  );
}
