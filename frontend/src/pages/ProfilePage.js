import React, { useContext } from "react";
import { Card, Box, Container, CardContainer, CardContent, Typography, Divider, CardActions, Button } from '@mui/material';
import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const ProfilePage = () => {
    let { user, logoutUser } = useContext(AuthContext);
  return (
    <div>
      <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Container maxWidth="md">
      <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <Avatar
          src={user.avatar}
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
        /> */}
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {user.username}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {`Edmonton`}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {"trial"}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        color="primary"
        fullWidth
        variant="text"
      >
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
