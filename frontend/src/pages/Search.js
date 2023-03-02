import { useContext } from "react";
// import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import BasePath from "../config/BasePath";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  Container,
  CardContainer,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Button,
  Avatar,
  Grid,
  ListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { width } from "@mui/system";

let followingList = [];
let sentList = [];
let searching = false;

function CreateArray() {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(0);
  const [following, setFollowing] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [sentList, setSentList] = useState([]);

  const [expanded, setExpanded] = useState(false);
  let { user, logoutUser } = useContext(AuthContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function getData() {
    fetch(BasePath + "/author/all/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setAuthors(result);
        setPage(page + 1);
      });
  }

  if (page < 1) {
    getData();
    getFollowing();
    getSentRequests();
    console.log(authors);
  }

  async function getFollowing() {
    fetch(BasePath + "/following/" + user.user_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("printint out following list", data);
        setFollowing(data);

        let updatedFollowingList = [];
        for (let i = 0; i < data.length; i++) {
          if (!followingList.includes(data[i].following.id)) {
            updatedFollowingList.push(data[i].following.id);
          }
        }
        setFollowingList(updatedFollowingList);
      })
      .catch((err) => console.log(err));
  }

  async function getSentRequests() {
    fetch(BasePath + "/requests_sent/" + user.user_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("printint out sent list", data);
        setSentRequests(data);

        let updatedSentList = [];
        for (let i = 0; i < data.length; i++) {
          updatedSentList.push(data[i].following.id);
        }
        setSentList(updatedSentList);
      })
      .catch((err) => console.log(err));
  }

  async function sendFollowRequest(id) {
    fetch(BasePath + "/follow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        follower: user.user_id,
        following: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("printint out sent list", data);

        getData();
        // getFollowing();
        getSentRequests();
      })
      .catch((err) => console.log(err));
  }

  async function cancelFollowRequest(id) {
    let follow_id = 0;

    for (let i = 0; i < sentRequests.length; i++) {
      if (sentRequests[i].following.id === id) {
        follow_id = sentRequests[i].id;
      }
    }

    let response;

    response = fetch(BasePath + "/request/" + follow_id + "/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower: user.user_id,
        following: id,
      }),
    });
    if ((await response).status === 204) {
      // await getFollowing();
      await getSentRequests();
      await getData();
      console.log("Deleted!");
    } else {
      console.log("Failed to delete!");
    }
  }

  const listItems = authors.map((author) => {
    if (author.username !== user.username && !followingList.includes(author.id))
      return (
        <Box
          sx={{
            flexGrow: 0.5,
            marginTop: "0.8em",
          }}
        >
          <Grid container spacing={0.5} wrap="wrap">
            <Grid item xs="auto" key={author.id}>
              <Container
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  width: "100%",
                  borderRadius: "1em",
                  boxShadow: 1,
                  p: 2,
                }}
              >
                <Avatar
                  src={author.profile_image_url}
                  alt="profile-image"
                  sx={{
                    height: 120,
                    width: 120,
                    margin: "auto",
                  }}
                />
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                  }}
                >
                  <h3>{author.username}</h3>
                </div>

                <IconButton
                  sx={{
                    "&:hover": { color: "red" },
                    marginTop: "1em",
                    display: "block",
                  }}
                >
                  {sentList.includes(author.id) ? (
                    <>
                      <Box>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "green",
                            width: "100%",
                            marginBottom: "0.5em",
                          }}
                        >
                          Request Sent
                        </Button>
                      </Box>

                      <Box>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "red" }}
                          onClick={() => cancelFollowRequest(author.id)}
                        >
                          Cancel Request
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendFollowRequest(author.id)}
                    >
                      Send Follow Request
                    </Button>
                  )}
                </IconButton>
              </Container>
            </Grid>
          </Grid>
        </Box>
      );

    return null;
  });

  return (
    <Grid container spacing={1}>
      {listItems}
    </Grid>
  );
}

export default function SearchPage() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Container maxWidth="md">
          <CardContent
            sx={{
              height: "fit-content",
              bgcolor: "background.paper",
              marginTop: "0.5em",
              borderRadius: "1em",
              border: "1px",
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                height: "fit-content",
              }}
            >
              <form
                style={{ display: "flex", alignItems: "center", height: "2em" }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  style={{ outline: "none", ":hover": { outline: "none" } }}
                ></input>
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </Box>
          </CardContent>

          <h2 style={{ textAlign: "center", padding: "0.5em" }}>
            Suggested Users
          </h2>
          <CreateArray />
        </Container>
      </Box>
    </div>
  );
}
