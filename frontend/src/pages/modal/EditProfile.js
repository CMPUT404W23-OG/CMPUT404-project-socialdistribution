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
import AuthContext from "../../context/AuthContext";
import BasePath from "../../config/BasePath";
import axios from "axios";

export default function EditProfile({ open, setOpen }) {
  var { user } = useContext(AuthContext);
  const [imageUrl, setUrl] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  async function SubmitContent() {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const options = {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      },
    };
    await axios.patch(
      BasePath + "/author/" + user.user_id + "/",
      {
        profile_image_url: imageUrl,
      },
      options
    );
    window.location.reload();
    handleClose();
  }

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
          <DialogTitle color={"black"}>Upload Image</DialogTitle>
          <DialogContent>
            {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
            <TextField
              // error={submitted}
              autoFocus
              margin="dense"
              id="ImageURL"
              label="Image URL"
              type="ImageURL"
              fullWidth
              variant="outlined"
              sx={{ width: "100%" }}
              multiline
              rows={1}
              onChange={(e) => setUrl(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => SubmitContent()}>Update</Button>
          </DialogActions>
        </Container>
      </Dialog>
    </div>
  );
}
