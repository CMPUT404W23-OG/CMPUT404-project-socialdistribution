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
import { useState } from "react";
import { editComment } from "../HomePage";

export default function EditComment({
  open,
  setCommentEditOpen,
  postID,
  commentID,
  comment,
}) {
  const [CommentText, setText] = useState("");

  const handleClose = () => {
    setCommentEditOpen(false);
  };

  function SubmitContent(postID, commentID) {
    editComment(postID, commentID, CommentText);
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
          <DialogTitle color={"black"}>Edit Comment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="EditComment"
              label="Edit Comment"
              type="EditComment"
              fullWidth
              variant="outlined"
              sx={{ width: "100%" }}
              multiline
              rows={5}
              defaultValue={comment}
              onChange={(e) => setText(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => SubmitContent(postID, commentID)}>
              Update
            </Button>
          </DialogActions>
        </Container>
      </Dialog>
    </div>
  );
}
