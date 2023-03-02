import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Container} from "@mui/material";
import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import BasePath from "../../config/BasePath";
import axios from "axios";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function PostsDialog({postType, open, setOpen}) {
    const navigate = useNavigate();

    var { user, logoutUser } = useContext(AuthContext);
    const [postTitle, setTitle] = useState( "");
    const [postText, setText] = useState( "");
    const [imageUrl, setUrl] = useState("");
    const [submitted, setSubmitted] = useState(false);

    var user_name = 'Author Not Found'
    if (user) {
        user_name = user.username
    }
    const post_title = postTitle

    let cont_type = ""
    if (postType === "text") {
        cont_type = "text/plain"
    } else if (postType === "markdown") {
        cont_type = "text/markdown"
    } else if (postType === "image") {
        cont_type = "image/png;base64"
    } else if (postType === "textImage") {
        cont_type = "text/textImage"
    }

    const headers = {  
        "Content-Type":"application/json",
        
    }   
    const payload = {
        "title":post_title,
        "description": "private description here",
        "body": postText,
        "image_url":"",
        "contentType":cont_type,
        "author_id":null,
        "author_name":user_name,
        "visibility":"PUBLIC",
    };
    console.log(payload)
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if (event.target.checked) {
            payload.visibility = "FRIENDS"
        } else {
            payload.visibility = "PUBLIC"
        }
    }

    const SubmitContent = async () => {
        // setSubmitted(true);
        await axios.post(`http://127.0.0.1:8000/posts/create/3`, payload, headers
        )
         //, headers, payload);
        navigate("/");
        window.location.reload();
        handleClose();
    };


    if (submitted) {
        // navigate("/");
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}
        //    maxWidth="100%"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: '100%',
          }}
            >
                <Container maxWidth="lg">
                <DialogTitle color={"black"}>Create Post</DialogTitle>
                <DialogContent>
                    {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
                    <TextField
                        // error={submitted}
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="title"
                        fullWidth
                        variant="outlined"
                        sx={{width: "100%"}}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {postType === "text" || postType === "markdown" || postType === "textImage" ? (
                        <TextField
                        // error={submitted}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="What's on your mind?"
                        type="email"
                        fullWidth
                        variant="outlined"
                        sx={{width: "100%"}}
                        onChange={(e) => setText(e.target.value)}
                    />
                    ) : ""}
                    {postType === "image" || postType === "textImage" ? (
                        <>
                        <TextField
                        // error={submitted}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Image URL"
                        type="email"
                        fullWidth
                        variant="outlined"
                        sx={{width: "100%"}}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <Typography variant="body2" sx={{color: "grey", marginTop: "10px", marginBottom: "10px"
                }} align="center"
                >Or</Typography>
                    <Button variant="contained" sx={{width: "100%"}}>Upload Image</Button>
                    </>
                    ) : ""}
                <FormGroup>
                    <FormControlLabel control={<Checkbox 
                    onChange={handleChange}
                    />} label="Private" />
                 </FormGroup>
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={SubmitContent}>Post</Button>
                </DialogActions>
                </Container>
            </Dialog>
        </div>
    );

};
