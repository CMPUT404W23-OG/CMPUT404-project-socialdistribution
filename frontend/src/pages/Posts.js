import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

let postType = "text";

export default function Posts(postType) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [Posttext, setText] = useState({Text: ""});
    const [submitted, setSubmitted] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const postContent = () => {
        setSubmitted(true);
        // const action = login(user);
        // dispatch(action);
    };


    if (submitted) {
        navigate("/home");
        handleClose();
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Post
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle color={"black"}>Create Post</DialogTitle>
                <DialogContent>
                    {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
                    <TextField
                        // error={submitted && !user.username}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Username"
                        type="email"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setText({...Posttext, text: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={postContent}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};
