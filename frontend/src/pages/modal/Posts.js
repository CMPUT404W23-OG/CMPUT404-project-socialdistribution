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

export default function PostsDialog({ postType, open, setOpen, edit, post }) {
  const navigate = useNavigate();
  var { user } = useContext(AuthContext);
  const [postTitle, setTitle] = useState("");
  const [postText, setText] = useState("");
  const [imageUrl, setUrl] = useState("");
  const [fileSelected, setFileSelected] = useState(null);
  // const [submitted, setSubmitted] = useState(false);

  var user_name = "Author Not Found";
  var userId = 0;
  if (user) {
    user_name = user.username;
    userId = user.user_id;
  }
  // const post_title = postTitle
  const fileInput = useRef(null);

  let cont_type = "";
  console.log(postType);
  if (postType === "text/plain") {
    cont_type = "text/plain";
  } else if (postType === "text/markdown") {
    cont_type = "text/markdown";
  } else if (postType === "image/png;base64") {
    cont_type = "image/png;base64";
  }

  const headers = {
    "Content-Type": "application/json",
  };
  const payload = {
    title: postTitle,
    description: "private description here",
    public: true,
    body: postText,
    image_url: imageUrl,
    contentType: cont_type,
    author_id: userId,
    author_name: user_name,
    visibility: "PUBLIC",
    type: "post",
    image_file: fileSelected,
  };

  var editPayload = {
    author_id: userId,
    visibility: "PUBLIC",
    public: true,
    contentType: cont_type,
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      payload.visibility = "FRIENDS";
      editPayload.visibility = "FRIENDS";
    } else {
      payload.visibility = "PUBLIC";
      editPayload.visibility = "PUBLIC";
    }
  };

  const SubmitContent = async () => {
    // setSubmitted(true);
    if (edit) {
      if (postTitle !== "") {
        editPayload.title = postTitle;
      }
      if (postText !== "") {
        editPayload.body = postText;
      }
      if (imageUrl !== "") {
        editPayload.image_url = imageUrl;
      } else if (fileSelected !== null) {
        editPayload.image_file = fileSelected;
        editPayload.image_url = "";
      }

      console.log(editPayload);
      await axios.patch(
        BasePath + `/posts/` + post.id + `/`,
        editPayload,
        headers
      );
      //   navigate("/");
      //   window.location.reload();
    } else {
      await axios.post(BasePath + `/posts/create/` + userId, payload, headers);
      navigate("/");
      window.location.reload();
    }
    handleClose();
  };

  // if (submitted) {
  //     // navigate("/");
  //     handleClose();
  // }

  const uploadImage = async (event) => {
    const image_file = event.target.files[0];
    const base64 = await convertImage(image_file);
    setFileSelected(base64);
  };

  // https://medium.com/nerd-for-tech/how-to-store-an-image-to-a-database-with-react-using-base-64-9d53147f6c4f
  const convertImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function handleClick() {
    fileInput.current.focus();
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
              sx={{ width: "100%" }}
              defaultValue={post ? post.title : ""}
              onChange={(e) => setTitle(e.target.value)}
            />
            {postType === "text/plain" ||
            postType === "text/markdown" ||
            postType === "image/png;base64" ? (
              <TextField
                // error={submitted}
                autoFocus
                margin="dense"
                id="text"
                label="What's on your mind?"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={post ? post.body : ""}
                sx={{ width: "100%" }}
                multiline
                rows={5}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              ""
            )}
            {postType === "image" || postType === "image/png;base64" ? (
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
                  defaultValue={post ? post.image_url : ""}
                  sx={{ width: "100%" }}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  align="center"
                >
                  Or
                </Typography>
                <input
                  type="file"
                  name="Image"
                  onChange={uploadImage}
                  ref={fileInput}
                />
                {edit ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Exisitng file:-{" "}
                    {post ? post.image_file : "No Uploaded File"}
                  </Typography>
                ) : (
                  ""
                )}

                {/* <Button variant="contained" sx={{width: "100%"}} onClick={handleClick}>Upload Image</Button> */}
              </>
            ) : (
              ""
            )}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    defaultChecked={
                      post
                        ? post.visibility === "FRIENDS"
                          ? true
                          : false
                        : false
                    }
                  />
                }
                label="Private"
              />
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
}
