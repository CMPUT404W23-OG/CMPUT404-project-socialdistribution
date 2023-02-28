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
import BasePath from "../config/BasePath";



const ProfilePage = () => {
  let { user, logoutUser } = useContext(AuthContext);
  let [url, setUrl] = useState();

  // https://stackoverflow.com/questions/69078642/how-use-get-method-in-react-js
  let profile_image_url = async () => {
    let response = await fetch(BasePath + "/author/"+user.user_id+"/", {
      method: "GET",
    });
    response.json().then((response) => setUrl(response.profile_image_url));
  }

  useEffect(() => {
    profile_image_url();
  }, []);
 
  
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
                  src={url} alt="profile-image"
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
                    <a href="/Followers">Followers</a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a href="/Following">Following</a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a href="/TrueFriends">True Friends</a>
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
