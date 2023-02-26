import React, { useContext } from "react";
import {
  Card,
  Box,
  Container,
  CardContainer,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const ProfilePage = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          paddingTop: "30px",
        }}
      >
        <Container maxWidth="md">
          <Card>
            <CardContent>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  //   src={}
                  sx={{
                    height: 64,
                    mb: 2,
                    width: 64,
                  }}
                />
                <Typography color="textPrimary" gutterBottom variant="h5">
                  {user.username}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {`Edmonton`}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {"trial"}
                </Typography>
              </Box>
            </CardContent>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth="md">
                <Grid container spacing={4}>
                  <Grid item lg={4} md={6} xs={12}>
                    <a href="/followers">Followers</a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a href="/following">Following</a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a href="/truefriends">True Friends</a>
                  </Grid>
                </Grid>
              </Container>
            </Box>
            <Divider />
            <CardActions>
              <Button color="primary" fullWidth variant="text">
                Upload picture
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

export default ProfilePage;
