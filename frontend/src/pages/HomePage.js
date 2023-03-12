import { Card, Box, Container, Menu, MenuItem } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import BasePath from "../config/BasePath";
import * as React from "react";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Comments from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format, set } from "date-fns";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Divider, Grid, Paper } from "@mui/material";


function CreateArray() {
  var { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [postList, setPostList] = useState([]);
  const [wasLast, setWasLast] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [anchorComments, setAnchorComments] = useState(null);
  const [menuId, setMenuId] = useState(0)
  // const [commentSection, setCommentSection] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isCommentsOpen = Boolean(expanded);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentsOpen = (event) => {
    setExpanded(event.currentTarget);
  };

  const handleCommentsClose = () => {
    setExpanded(null);
  };

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  var location = useLocation();

  const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

  let commentsId = "primary-comments-post"
  // const ExpandMore = styled((props) => {
  //   // anchorEl = {anchorComments}
  //   const { expand, ...other } = props;
  //   return <IconButton {...other} 
  //   anchorEl = {expanded}
  //   id = {commentsId}
  //   open = {isCommentsOpen}
  //   onClose = {handleCommentsClose}
  //   />;
  // })(({ theme, expand }) => ({
  //   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  //   // marginLeft: 'auto',
  //   transition: theme.transitions.create("transform", {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  // }));

  let renderComments = (
    <Collapse 
    in={expanded} 
    id={commentsId}
    // open={isCommentsOpen}
    // onClose={handleCommentsClose}
    timeout="auto" 
    unmountOnExit>
        <CardContent>
          <Typography paragraph>
              <div><h1>"THIS IS A TEST"</h1></div>
          </Typography>
        </CardContent>
      </Collapse>
  );


  let menuIdPost = "primary-menu-post";
  const renderMenuPost = (
    <Menu
      anchorEl={anchorEl}
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
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem> Edit</MenuItem>
      <MenuItem> Delete</MenuItem>
    </Menu>
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
  };

  useEffect(() => {
    if (location.state) {
      console.log("location.state is", location.state);
      const getData = async () => {
        const res = await axios.get(
          BasePath + "/posts/" + location.state + "/",
          headers
        );

        if (!res.data.length) {
          setWasLast(true);
        }

        setPostList([res.data]);
        location.state = null;
      };
      getData();
      window.history.replaceState({}, document.title);
    } else {
      const getData = async () => {
        const res = await axios.get(
          BasePath + `/posts/all/?page=${currPage}&size=5`,
          headers
        );
        console.log(res.data[0]);
        if (!res.data.length) {
          setWasLast(true);
        }
        setPrevPage(currPage);
        setPostList([...postList, ...res.data]);
      };

      if (!wasLast && prevPage !== currPage) {
        getData();
      }
    }
  }, [currPage, prevPage, wasLast, postList]);

  useEffect(() => {
    const onScroll = () => {
      // console.log((window.innerHeight), ((window.innerHeight) * 2), window.scrollY, document.body.offsetHeight)
      setOffset(window.pageYOffset);
      if (
        window.innerHeight + 10 + window.scrollY >=
        document.body.offsetHeight
      ) {
        setCurrPage(currPage + 1);
      }
    };
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  function getImg(post) {
    if (!post.image_url) {
      return null;
    } else {
      return (
        <CardMedia
          component="img"
          height="194"
          image={post.image_url}
          alt={post.description}
        />
      );
    }
  }

  // function getComments(post) {
  //     return fetch(BasePath + `/posts/46/comments`)
  //     .then(function(res) {
  //       return res.json();
  //     }).then(function(json) {
  //       return json;
  //     });
    
  // }

  // function comm() {
  //   getComments().then(
  //     function(json) {
  //       setCommentSection(json)
  //     })
  // }

  const listItems = postList.map((post) =>
    <Box
      key={post.id}
      sx={{
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
      className={post.id}
    >
      <Container maxWidth="sm">
        <Card sx={{ maxWidth: 700 }} className={post.author}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
            }
            action={
              <IconButton
                aria-label="settings"
                aria-controls={menuIdPost}
                onClick={handleMenuOpen}
              >
                {userId === post.author_id ? (
                   <MoreVertIcon /> )
                    : (null)
                  }
               
              </IconButton>
            }
            title={post.title + " - " + post.author_name}
            subheader={format(new Date(post.datePublished), "MMMM d, yyyy")}
          />
      {getImg(post)}
      <CardContent>
      {getImg(post) === null ? (
         <Typography variant="h5" color="black">
         {post.body}
         </Typography>
      ): ( <Typography variant="h6" color="text.secondary">
      {post.body}
      </Typography>) }
       
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        {/* <IconButton 
        aria-label="comments"
        aria-controls={commentsId}
        onClick={handleCommentsOpen}
        >
          <Comments />
          </IconButton> */}
        {/* <ExpandMore
          expand={expanded}
          onClick={handleCommentsOpen}
          aria-expanded={expanded}
          aria-controls={commentsId}
          aria-label="show more"
        >
          <Comments />
        </ExpandMore> */}
      </CardActions>
      {/* https://stackoverflow.com/questions/43788878/scrollable-list-component-from-material-ui-in-react */}
      {/* https://codesandbox.io/s/comment-box-with-material-ui-10p3c?file=/src/index.js:153-285 */}
      <div style={{ padding: 14 }}>
      <h3 style={{padding: 20}}>Comments</h3>
      <Paper style={{ maxHeight: 200, overflow: 'auto'}}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={imgLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.
              Suspendisse congue vulputate lobortis. Pellentesque at interdum
              tortor. Quisque arcu quam, malesuada vel mauris et, posuere
              sagittis ipsum. Aliquam ultricies a ligula nec faucibus. In elit
              metus, efficitur lobortis nisi quis, molestie porttitor metus.
              Pellentesque et neque risus. Aliquam vulputate, mauris vitae
              tincidunt interdum, mauris mi vehicula urna, nec feugiat quam
              lectus vitae ex.{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={imgLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.
              Suspendisse congue vulputate lobortis. Pellentesque at interdum
              tortor. Quisque arcu quam, malesuada vel mauris et, posuere
              sagittis ipsum. Aliquam ultricies a ligula nec faucibus. In elit
              metus, efficitur lobortis nisi quis, molestie porttitor metus.
              Pellentesque et neque risus. Aliquam vulputate, mauris vitae
              tincidunt interdum, mauris mi vehicula urna, nec feugiat quam
              lectus vitae ex.{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
    </div>
      
    </Card>
  </Container>
  {renderMenuPost}
  {/* {renderComments} */}
  {/* {userId === post.author_id ? (
     {renderMenuPost}
  ): ( null )
    } */}
  
 
</Box>

)

  return <div>{listItems}</div>;
}

const HomePage = (props) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          paddingTop: "100px",
          paddingBottom: "30px",
        }}
      >
        <CreateArray />
      </Box>
    </div>
  );
};

export default HomePage;
