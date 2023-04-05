import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../themes/header.css";
import * as React from "react";
import { useState } from "react";
import { Link } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Add from "@mui/icons-material/AddToPhotos";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import People from "@mui/icons-material/PeopleAlt";
import Posts from "../pages/modal/Posts";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  const navigate = useNavigate();
  let { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPost, setanchorElPost] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isPostOpen = Boolean(anchorElPost);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [open, setOpen] = useState(false);
  const [PostType, setType] = useState("");

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePostMenuOpen = (event) => {
    setanchorElPost(event.currentTarget);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  function handlePost(postType) {
    handlePostMenuClose();
    setType(postType);
    setOpen(true);
  }

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handlePostMenuClose = () => {
    setanchorElPost(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}> Profile</MenuItem>
      <MenuItem onClick={handleLogout}> Logout</MenuItem>
    </Menu>
  );

  const menuIdPost = "primary-post-menu";
  const renderMenuPost = (
    <Menu
      anchorEl={anchorElPost}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuIdPost}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isPostOpen}
      onClose={handlePostMenuClose}
    >
      <MenuItem onClick={() => handlePost("text/plain")}>
        {" "}
        Post thoughts
      </MenuItem>
      <MenuItem onClick={() => handlePost("text/markdown")}>
        {" "}
        Markdown Post
      </MenuItem>
      {/* <MenuItem onClick={() => handlePost("image")}>
        {" "}
        Post an image
      </MenuItem> */}
      <MenuItem onClick={() => handlePost("image/png;base64")}>
        {" "}
        Post Image with caption
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
          aria-controls={menuIdPost}
          aria-haspopup="true"
          onClick={handlePostMenuOpen}
        >
          <Add />
          <Typography
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Add Post
          </Typography>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Link href="/" color="inherit">
            {" "}
            <Home />
          </Link>
          <Link
            href="/"
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Home
          </Link>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <People />
          <Link
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            href="/search"
          >
            Search
          </Link>
        </IconButton>
      </MenuItem>
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem>
        <IconButton
          size="large"
          // aria-label="show 17 new notifications"
          color="inherit"
        >
          {/* <Badge badgeContent={17} color="error"> */}
          <NotificationsIcon />
          <Link
            href="/inbox"
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Notifications
          </Link>
          {/* </Badge> */}
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <AccountCircle />
          <Link
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            href="/profile"
          >
            Profile
          </Link>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton
          size="large"
          // aria-label="show 17 new notifications"
          color="inherit"
        >
          {/* <Badge badgeContent={17} color="error"> */}
          <LogoutIcon />
          <Typography
            style={{
              color: "black",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Logout
          </Typography>
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {/* {user ? ( */}
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed">
            <Toolbar>
              {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton> */}
              <Link href="/" color="inherit" sx={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Social Distrubution
                </Typography>
              </Link>
              {user ? (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <IconButton
                      size="large"
                      // edge="end"
                      aria-label="posts menu"
                      aria-controls={menuIdPost}
                      aria-haspopup="true"
                      onClick={handlePostMenuOpen}
                      color="inherit"
                    >
                      <Add />
                    </IconButton>

                    <IconButton size="large" color="inherit">
                      <Link href="/" color="inherit">
                        {" "}
                        <Home />
                      </Link>
                    </IconButton>

                    <IconButton size="large" color="inherit">
                      <Link href="/search" color="inherit">
                        {" "}
                        <People />
                      </Link>
                    </IconButton>

                    {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
               </IconButton> */}

                    <IconButton
                      size="large"
                      // aria-label="show 17 new notifications"
                      color="inherit"
                    >
                      {/* <Badge badgeContent={17} color="error"> */}
                      <Link href="/inbox" color="inherit">
                        <NotificationsIcon />
                      </Link>
                      {/* </Badge> */}
                    </IconButton>

                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                      size="large"
                      aria-label="show more"
                      aria-controls={mobileMenuId}
                      aria-haspopup="true"
                      onClick={handleMobileMenuOpen}
                      color="inherit"
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <IconButton size="large" color="inherit">
                      <Link href="/" color="inherit">
                        {" "}
                        <Home />
                      </Link>
                    </IconButton>

                    <Link
                      href="/login"
                      sx={{ color: "inherit", padding: "20px" }}
                    >
                      Login
                    </Link>
                  </Box>
                </>
              )}
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenuPost}
          {renderMenu}
        </Box>
        <Posts postType={PostType} open={open} setOpen={setOpen} edit={false} />
      </>
    </>
  );
}
