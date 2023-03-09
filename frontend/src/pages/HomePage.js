import { Card, Box, Container, Menu, MenuItem } from '@mui/material';
import { useEffect, useState, useRef } from "react";
import BasePath from "../config/BasePath";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comments from '@mui/icons-material/Comment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
import axios from 'axios';
import AuthContext from "../context/AuthContext";
import { useContext } from "react";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  // marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


function CreateArray() {
  var { user } = useContext(AuthContext);
  const userId = user.user_id
  console.log(userId);
  console.log(user);
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [postList, setPostList] = useState([])
  const [wasLast, setWasLast] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(0)
  // const [commentSection, setCommentSection] = useState(comments);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


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
      <MenuItem >
        {" "}
        Edit
      </MenuItem>
      <MenuItem >
        {" "}
        Delete
      </MenuItem>
      
    </Menu>
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "X-PAGINATION-SIZE"
  }

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(BasePath + `/posts/all/?page=${currPage}&size=5`, headers);
      console.log(res.data[0]);
      if (!res.data.length) {
        setWasLast(true)
      }
      setPrevPage(currPage)
      setPostList([...postList, ...res.data])
    }
    
    if (!wasLast && prevPage !== currPage) {
      getData()
    }     
      
  }, [currPage, prevPage, wasLast, postList])

  useEffect(() => {
    const onScroll = () => {
      // console.log((window.innerHeight), ((window.innerHeight) * 2), window.scrollY, document.body.offsetHeight)
      setOffset(window.pageYOffset)
      if ((window.innerHeight+10) + window.scrollY >= document.body.offsetHeight) {
        setCurrPage(currPage + 1)
        
      }
    }
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', onScroll)
        
    }, [offset]);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  function getImg(post) {
    if (!post.image_url) {
      return null
    } else {
      return (<CardMedia
      component="img"
      height="194"
      image={post.image_url}
      alt={post.description}
    />)
    }
  }
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
      <Card sx={{ maxWidth: 700 }}
      className={post.author}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
            <IconButton aria-label="settings"
            aria-controls={menuIdPost}
            onClick={handleMenuOpen}
            >
              <MoreVertIcon />
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
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <Comments />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Post ID: {post.id}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  </Container>
  {/* {renderMenuPost} */}
  {userId === post.author_id ? (
     {renderMenuPost}
  ): ( null )
    }
 
</Box>


  )
  

  return (
    <div>
      {listItems}
    </div>
  )
}


const HomePage = () => {
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
