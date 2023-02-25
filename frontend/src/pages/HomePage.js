import React from "react";
import { Card, Box } from '@mui/material';
import { useEffect, useState } from "react";


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
    
  const listItems = data.map(
    (element) => {
      return (

        <Box>
          <Card className={element.author}>{element.content}</Card>
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
