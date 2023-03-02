import { Card, Box, Container } from '@mui/material';
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
import ShareIcon from '@mui/icons-material/Share';
import Comments from '@mui/icons-material/Comment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
import axios from 'axios';


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


  
  // const [posts, setPosts] = useState([])
  // const [page, setPage] = useState(0)
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [postList, setPostList] = useState([])
  const [wasLast, setWasLast] = useState(false)
  // const [commentSection, setCommentSection] = useState(comments);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "X-PAGINATION-SIZE"
  }
  

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(BasePath + `/posts/all/?page=${currPage}&size=5`, headers);
      console.log(res.data)
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
    console.log('here')
    const onScroll = () => {
      setOffset(window.pageYOffset)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setCurrPage(currPage + 1)
        
      }
    }
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', onScroll)
        
    }, []);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const listItems = postList.map((post) =>
    <Box
    key={post.id}
    sx={{
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      width: "100%",
      paddingTop: "30px",
      paddingBottom: "30px",
      paddingLeft: "500px",
    }}
    className={post.id}
    
  >
    <Container maxWidth="lg">
      <Card sx={{ maxWidth: 700 }}
      className={post.author}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.title + " - " + post.author_name}
        subheader={format(new Date(post.datePublished), "MMMM d, yyyy")}



      />
      <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {post.body}
        </Typography>
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
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  </Container>
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
      <CreateArray />
          </div>
  );
};

export default HomePage;
