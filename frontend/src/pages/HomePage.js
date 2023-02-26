import React from "react";
import { Card, Box, Container } from '@mui/material';
import { useEffect, useState } from "react";

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    // create example data
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
    }
    ];

    // fetch data from backend
    useEffect(() => {
        // fetch("http://localhost:8000/api/posts/")
        // .then((res) => res.json())
        // .then((data) => {
        //     setPosts(data);
        // });
        setPosts(data);
    }, []);

    // render post with author and content
    
    return (
        <div>
        {posts.map((post) => (
            <Box
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                width: '100%',
            }}
            >
            <Container maxWidth="md">
            <Card className={post.author}>{post.content}</Card>
            </Container>
            </Box>
        ))}
        </div>
    );
    };

export default HomePage;
