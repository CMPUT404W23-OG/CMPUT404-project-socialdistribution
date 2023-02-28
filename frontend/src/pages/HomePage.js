import React from "react";
import { Card, Box, Container } from '@mui/material';
import { useEffect, useState } from "react";
import BasePath from "../config/BasePath";


function CreateArray() {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [author, setAuthor] = useState("")
  
  function getData() {
    fetch(BasePath+'/posts/all/', {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
      setPosts((result))
      setPage(page+1)
    })
  }

  // function to get author from the id

  // function getAuthor(post) {
  //   var author_id = parseInt(post.author)
  //   console.log("here"+author_id)
  //   fetch(BasePath+'/author/'+author_id+'/', {
  //     method: 'GET',
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     }
  //   })
  //   .then((res) => res.json())
  //   .then((result) => {
  //     return result
  //   })

  // }
  if (page < 1) {
    getData()

  }
  
  const listItems = posts.map((post) =>
      <Box className={post.id}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        width: '100%',
        margin:'15px',
        border: '2px solid black'
      }}>
        <Container maxWidth="md">
        <Card className={post.author}>
          <h1>{post.title}</h1>
          <h2>Author: {post.author}</h2>
          <p>{post.body}</p>
          
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
