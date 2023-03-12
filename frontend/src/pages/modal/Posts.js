import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Container} from "@mui/material";
import {useState, useContext, useRef} from "react";
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
    const [postTitle, setTitle] = useState("");
    const [postText, setText] = useState("");
    const [imageUrl, setUrl] = useState("");
    const [fileSelected, setFileSelected] = useState(null);
    // const [submitted, setSubmitted] = useState(false);

    var user_name = 'Author Not Found'
    var userId = 0
    if (user) {
        user_name = user.username
        userId = user.user_id
    }
    // const post_title = postTitle
    const fileInput = useRef(null)

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
        "title":postTitle,
        "description": "private description here",
        "public": true,
        "body": postText,
        "image_url":imageUrl,
        "contentType":cont_type,
        "author_id":userId,
        "author_name":user_name,
        "visibility":"PUBLIC",
        "type":"post",
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
        await axios.post(BasePath+`/posts/create/`+userId, payload, headers
        )
        
        navigate("/");
        window.location.reload();
        handleClose();
    };

    const uploadImage = (event) => {
        setFileSelected(event.target.files[0]);
    }

    function handleClick () {
        fileInput.current.focus();
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
                        multiline
                        rows={5}
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
                    <input type="file" name="Image" onChange={uploadImage} ref={fileInput}/>
                    {/* <Button variant="contained" sx={{width: "100%"}} onClick={handleClick}>Upload Image</Button> */}
                    
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
