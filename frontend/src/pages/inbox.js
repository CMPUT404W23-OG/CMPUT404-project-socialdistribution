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
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  let listOfPosts = [];
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
        fetch(
          BasePath + "/posts/author/" + user.user_id + "?page=1&size=1000",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        ),
      ])
        .then(([requestsResponse, followingResponse, myPostsResponse]) =>
          Promise.all([
            requestsResponse.json(),
            followingResponse.json(),
            myPostsResponse.json(),
          ])
        )
        .then(([requestsData, followingData, myPostsData]) => {
          console.log("populateRequests: ", requestsData);
          setRequests(requestsData);
          console.log(followingData);
          setFollowing(followingData);
          console.log("Testing following ", followingData);

          console.log("My posts are : ", myPostsData);

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

              for (let i = 0; i < followingPostList.length; i++) {
                for (let j = 0; j < followingPostList[i].length; j++) {
                  let found = false;
                  for (let k = 0; k < listOfPosts.length; k++) {
                    if (listOfPosts[k].id === followingPostList[i][j].id) {
                      found = true;
                    }
                  }
                  if (!found) {
                    listOfPosts.push(followingPostList[i][j]);
                  }
                }
              }
              listOfPosts.sort((a, b) => {
                return new Date(b.datePublished) - new Date(a.datePublished);
              });
              console.log("List of posts: ", listOfPosts);
              if (listOfPosts.length > posts.length) {
                setPosts(listOfPosts);
              }
            });
          }

          const myPostCommentsPromises = myPostsData.map((myPosts) =>
            fetch(BasePath + "/posts/" + myPosts.id + "/comments", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }).then((res) => res.json())
          );
          Promise.all(myPostCommentsPromises).then((myPostComments) => {
            console.log("My post comments: ", myPostComments);
            setComments(myPostComments);
            for (let i = 0; i < myPostComments.length; i++) {
              console.log("My post comments: ", myPostComments[i]);
              if (!myPostComments[i].detail) {
                try {
                  for (let j = 0; j < myPostComments[i].length; j++) {
                    let found = false;
                    for (let k = 0; k < listOfPosts.length; k++) {
                      if (
                        listOfPosts[k].id === myPostComments[i][j].post &&
                        listOfPosts[k].author_id ===
                          myPostComments[i][j].author.id
                      ) {
                        found = true;
                      }
                    }
                    if (!found) {
                      listOfPosts.push({
                        id: myPostComments[i][j].post,
                        author_image_url:
                          myPostComments[i][j].author.profile_image_url,
                        author_name: myPostComments[i][j].author.username,
                        author_id: myPostComments[i][j].author.id,
                        title:
                          myPostComments[i][j].author.username +
                          " commented on your post ",
                        body: myPostComments[i][j].comment,
                      });
                    }
                  }
                } catch {
                  console.log("Error in adding comment to list of posts");
                }

                console.log("Just update posts");

                // console.log("new post list  : ", listOfPosts);
              }
            }

            // if (listOfPosts.length > posts.length) {
            //   setPosts(listOfPosts);
            // }

            // console.log("List of posts after setting comments : ", listOfPosts);
          });
          const myPostLikesPromises = myPostsData.map((myPosts) =>
            fetch(BasePath + "/posts/" + myPosts.id + "/likes", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }).then((res) => res.json())
          );
          Promise.all(myPostLikesPromises).then((myPostLikes) => {
            // console.log("My post likes: ", myPostLikes);
            setLikes(myPostLikes);
            for (let i = 0; i < myPostLikes.length; i++) {
              // console.log("My post likes: ", myPostLikes[i]);
              if (!myPostLikes[i].detail) {
                try {
                  for (let j = 0; j < myPostLikes[i].length; j++) {
                    let found = false;
                    for (let k = 0; k < listOfPosts.length; k++) {
                      if (
                        listOfPosts[k].id === myPostLikes[i][j].post &&
                        listOfPosts[k].author_id === myPostLikes[i][j].author.id
                      ) {
                        found = true;
                      }
                    }
                    if (!found) {
                      listOfPosts.push({
                        id: myPostLikes[i][j].post,
                        author_image_url:
                          myPostLikes[i][j].author.profile_image_url,
                        author_name: myPostLikes[i][j].author.username,
                        author_id: myPostLikes[i][j].author.id,
                        title:
                          myPostLikes[i][j].author.username +
                          " liked your post ",
                        body: myPostLikes[i][j].comment,
                      });
                    }
                  }
                } catch {
                  console.log("Error in adding like to list of posts");
                }

                // console.log("new post list  : ", listOfPosts);
              }
            }
          });

          if (listOfPosts.length > posts.length) {
            setPosts(listOfPosts);
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
                <Avatar
                  src={request.follower.profile_image_url}
                  alt="Profile Picture"
                  sx={{ marginLeft: "0.5em" }}
                ></Avatar>
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
                  <Avatar
                    src={post.author_image_url}
                    alt="Profile Picture"
                  ></Avatar>
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
