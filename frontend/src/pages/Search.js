import { useContext } from "react";
// import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import * as React from "react";

import BasePath from "../config/BasePath";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";

import SearchIcon from "@mui/icons-material/Search";
import { Container, CardContent, Button, Avatar, Grid } from "@mui/material";
import { useState } from "react";

let searching = false;
let searchQuery = "";

function SearchUser() {
  searching = true;
  console.log("searching");

  let doc = document.getElementById("search");
  console.log(doc.value);
  if (doc.value === "") {
    searching = false;
    console.log("not searching");
  } else {
    searchQuery = doc.value;
    console.log("searching");
    searching = true;
  }
}

function CreateArray() {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(0);
  const [sentRequests, setSentRequests] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [sentList, setSentList] = useState([]);

  // const [expanded, setExpanded] = useState(false);
  let { user } = useContext(AuthContext);

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

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
      await getSentRequests();
      console.log("Deleted!");
    } else {
      console.log("Failed to delete!");
    }
  }

  const listItems = authors.map((author) => {
    if (!searching) {
      if (
        author.username !== user.username &&
        !followingList.includes(author.id)
      )
        return (
          <Box
            sx={{
              flexGrow: 0.03,
              marginTop: "0.8em",
            }}
            key={author.id}
          >
            <Grid container spacing={2} wrap="wrap">
              <Grid item xs="auto" key={author.id}>
                <Container
                  sx={{
                    backgroundColor: "paper",
                    width: "100%",
                    borderRadius: "1em",
                    boxShadow: 1,
                    p: 2,
                  }}
                  style={{
                    border: "1px solid gray",
                    padding: "1em",
                    boxShadow: "4px 4px 4px -4px ",
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
                    {sentList.includes(author.id) ? (
                      <DoneIcon
                        sx={{
                          color: "green",
                          width: "auto",
                          height: "1.7em",
                          marginLeft: "auto",
                        }}
                      />
                    ) : (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </div>

                  {sentList.includes(author.id) ? (
                    <>
                      <Box>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "red",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                          onClick={() => cancelFollowRequest(author.id)}
                        >
                          &nbsp;&nbsp;&nbsp;Cancel Request &nbsp;&nbsp; &nbsp;
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "green" }}
                      onClick={() => sendFollowRequest(author.id)}
                    >
                      Send Follow Request
                    </Button>
                  )}
                </Container>
              </Grid>
            </Grid>
          </Box>
        );
    }

    if (searching) {
      if (
        author.username !== user.username &&
        author.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return (
          <Box
            sx={{
              flexGrow: 0.03,
              marginTop: "0.8em",
            }}
          >
            <Grid container spacing={2} wrap="wrap">
              <Grid item xs="auto" key={author.id}>
                <Container
                  sx={{
                    backgroundColor: "paper",
                    width: "100%",
                    borderRadius: "1em",
                    boxShadow: 1,
                    p: 2,
                  }}
                  style={{
                    border: "1px solid gray",
                    padding: "1em",
                    boxShadow: "4px 4px 4px -4px ",
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
                    {sentList.includes(author.id) ? (
                      <DoneIcon
                        sx={{
                          color: "green",
                          width: "7.9em",
                          height: "1.7em",
                          marginLeft: "auto",
                        }}
                      />
                    ) : (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </div>

                  {sentList.includes(author.id) ? (
                    <>
                      <Box>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "red" }}
                          onClick={() => cancelFollowRequest(author.id)}
                        >
                          &nbsp;&nbsp;&nbsp;Cancel Request &nbsp;&nbsp; &nbsp;
                        </Button>
                      </Box>
                    </>
                  ) : followingList.includes(author.id) ? (
                    <>
                      <div>
                        <Button variant="contained" sx={{ bgcolor: "purple" }}>
                          &nbsp;&nbsp;&nbsp;Followed Already&nbsp;&nbsp;&nbsp;
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "green" }}
                      onClick={() => sendFollowRequest(author.id)}
                    >
                      Send Follow Request
                    </Button>
                  )}
                </Container>
              </Grid>
            </Grid>
          </Box>
        );
    }
    return null;
  });

  return (
    <Grid container spacing={0}>
      {listItems}
    </Grid>
  );
}

export default function SearchPage() {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  console.log("rendering...");

  const searching_result = () => {
    SearchUser();
    forceUpdate();
  };

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
                style={{
                  display: "inline",
                  alignItems: "center",
                  height: "2em",
                  position: "relative",
                }}
              >
                <SearchIcon
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.5em",
                    transform: "translateY(-50%",
                  }}
                />
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  style={{
                    outline: "none",
                    ":hover": { outline: "none" },
                    ":focus": { outline: "none" },
                    paddingLeft: "2.5em",
                  }}
                  onChange={() => searching_result()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searching_result();
                    }
                  }}
                ></input>
              </form>
            </Box>
          </CardContent>

          {searching ? (
            <h2 style={{ textAlign: "center", padding: "0.5em" }}>
              Search Results
            </h2>
          ) : (
            <h2 style={{ textAlign: "center", padding: "0.5em" }}>
              Suggested Users
            </h2>
          )}

          <CreateArray />
        </Container>
      </Box>
    </div>
  );
}
