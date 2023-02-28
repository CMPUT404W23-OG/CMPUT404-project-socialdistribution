import React from "react";
import { Card, Box, Container } from '@mui/material';
import { useEffect, useState } from "react";
import BasePath from "../config/BasePath";


function CreateArray() {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const data = [
    { 
      "author": "John Doe", 
      "content": "test content"
    },
    { 
      "author": "April May", 
      "content": "two months as a name thats wack"
    },
    { 
      "author": "Jack Awesome", 
      "content": "I am a super spy"
    },
    { 
      "author": "Bill Gates", 
      "content": "I like money"
    },
    { 
      "author": "Ya Boi", 
      "content": "skinny what?"
    }
  ]
  
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
  if (page < 1) {
    getData()
  }
  console.log(posts)
  
  const listItems = posts.map((post) =>
      <Box
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        width: '100%',
        margin:'15px',
        border: '2px solid black'
      }}>
        <Container maxWidth="md">
        <Card className={post.id}>
          <h1>{post.title}</h1>
          <h2>{post.author}</h2>
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
