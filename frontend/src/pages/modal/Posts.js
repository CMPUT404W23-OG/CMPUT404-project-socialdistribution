import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Container} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

// PostsDialogProps = {
//     postType: string,
//     open: boolean,
//     setOpen: (open)
//   };

export default function PostsDialog({postType, open, setOpen}) {
    // console.log("PostType: ", postType);
    const navigate = useNavigate();
    // const [open, setOpen] = useState(false);
    const [postText, setText] = useState( "");
    const [imageUrl, setUrl] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const SubmitContent = () => {
        // setSubmitted(true);
        // const action = login(user);
        // dispatch(action);
        navigate("/");
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
                    {postType === "text" || postType === "markdown" || postType === "textImage" ? (
                        <TextField
                        // error={submitted && !user.username}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="What's on your mind?"
                        type="email"
                        fullWidth
                        variant="outlined"
                        sx={{width: "100%"}}
                        onChange={(e) => setText({...postText, text: e.target.value})}
                    />
                    ) : ""}
                    {postType === "image" || postType === "textImage" ? (
                        <>
                        <TextField
                        // error={submitted && !user.username}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Image URL"
                        type="email"
                        fullWidth
                        variant="outlined"
                        sx={{width: "100%"}}
                        onChange={(e) => setUrl({...imageUrl, text: e.target.value})}
                    />
                    <Typography variant="body2" sx={{color: "grey", marginTop: "10px", marginBottom: "10px"
                }} align="center"
                >Or</Typography>
                    <Button variant="contained" sx={{width: "100%"}}>Upload Image</Button>
                    </>
                    ) : ""}
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
