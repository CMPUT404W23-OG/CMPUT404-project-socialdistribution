import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

// PostsDialogProps = {
//     postType: string,
//     open: boolean,
//     setOpen: (open)
//   };

export default function PostsDialog({postType, open, setOpen}) {
    console.log("PostType: ", postType);
    const navigate = useNavigate();
    // const [open, setOpen] = useState(false);
    const [Posttext, setText] = useState({Text: ""});
    const [ImageUrl, setUrl] = useState({Text: ""});
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
            sx={{
                minWidth: "900px",
                minHeight: "500px",
            }}
            >
                <DialogTitle color={"black"}>Create Post</DialogTitle>
                <DialogContent>
                    {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
                   
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
                        onChange={(e) => setText({...Posttext, text: e.target.value})}
                    />
                   
                   
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={SubmitContent}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};
