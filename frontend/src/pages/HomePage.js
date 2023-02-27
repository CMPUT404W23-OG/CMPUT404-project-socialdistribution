import React from "react";
import { Card, Box, Container } from '@mui/material';
import { useEffect, useState } from "react";
import BasePath from "../config/BasePath";


function CreateArray() {

  
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
  
  // let response = fetch(BasePath + "/posts", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
    
  const listItems = data.map(
    (element) => {
      return (

        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Container maxWidth="md">
          <Card className={element.author}>{element.content}</Card>
          </Container>
        </Box>
        
        // <ul type='disc'>
        //   <li style={{ fontWeight: 'bold', color:'red'}}>{element.author}</li>
        //   <li>{element.content}</li>
        // </ul>
      )
    }
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
