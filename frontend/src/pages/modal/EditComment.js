import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import BasePath from "../../config/BasePath";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function EditComment({ open, setCommentEditOpen }) {
  const navigate = useNavigate();

  var { user } = useContext(AuthContext);
  const [postText, setText] = useState("");

  var user_name = "Author Not Found";
  var userId = 0;
  if (user) {
    user_name = user.username;
    userId = user.user_id;
  }

  const handleClose = () => {
    setCommentEditOpen(false);
  };

  const SubmitContent = async () => {
    // setSubmitted(true);
    //   await axios.post(BasePath + `/posts/create/` + userId, payload, headers);
    navigate("/");
    window.location.reload();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        //    maxWidth="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          m: "auto",
          width: "100%",
        }}
      >
        <Container maxWidth="lg">
          <DialogTitle color={"black"}>Edit Comment</DialogTitle>
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
              sx={{ width: "100%" }}
              onChange={(e) => setText(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={SubmitContent}>Update</Button>
          </DialogActions>
        </Container>
      </Dialog>
    </div>
  );
}
