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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function CreateArray() {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(0);

  const [expanded, setExpanded] = useState(false);
  let { user, logoutUser } = useContext(AuthContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function getData() {
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
    console.log(authors);
  }

  const listItems = authors.map((author) => {
    if (author.username !== user.username)
      return (
        <Box sx={{ flexGrow: 0.5, marginTop: "0.8em" }}>
          <Grid container spacing={1} wrap="wrap">
            <Grid item xs="auto" key={author.username}>
              <item>
                <Container
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    width: "auto",
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
                      // mb: 10,
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
                    sx={{ "&:hover": { color: "red" }, marginTop: "1em" }}
                  >
                    <Button variant="contained">Send Follow Request</Button>
                  </IconButton>
                </Container>
              </item>
            </Grid>
          </Grid>
        </Box>
      );
    return null;
  });

  return (
    <Grid container spacing={0.5}>
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
          <Box sx={{ mt: 3, marginTop: "1em" }}>
            <Card
              sx={{
                height: "4em",
                margin: "auto",
              }}
            >
              <CardContent>
                <Box>
                  <Search
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      position: "relative",
                      marginTop: "-1.2em",
                      ":hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <h2 style={{ textAlign: "center", padding: "0.5em" }}>
            Suggested Users
          </h2>
          <CreateArray />
        </Container>
      </Box>
    </div>
  );
}
