import React, { useContext } from "react";
import {
  Card,
  Box,
  Container,
  CardContainer,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Button,
  Avatar,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import BasePath from "../config/BasePath";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Comments from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format, set } from "date-fns";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { fontSize } from "@mui/system";
import Posts from "../pages/modal/Posts";
import EditComment from "../pages/modal/EditComment";
import EditProfile from "../pages/modal/EditProfile";

async function addComment(userId, postId, comment) {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authTokens.access}`,
  };

  const data = JSON.stringify({
    author: userId,
    comment: comment,
    contentType: "text/plain",
  });

  const response = await fetch(BasePath + `/posts/` + postId + "/comments", {
    method: "POST",
    headers: headers,
    body: data,
  });
  return response.json();
}

function CommentBox({ userId, pid, onAddComment }) {
  const [comment, setComment] = useState("");
  return (
    <div style={{ padding: 14 }}>
      <TextField
        margin="dense"
        id="comment"
        label="Write Comment"
        placeholder="Comment goes here..."
        type="text"
        fullWidth
        variant="outlined"
        multiline
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        key={pid}
      />
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
        }}
      >
        <Button
          key={pid}
          onClick={() => {
            addComment(userId, pid, comment).then((newComment) => {
              onAddComment(newComment);
              setComment("");
            });
          }}
        >
          Add
        </Button>
      </Box>
    </div>
  );
}

export async function editComment(postID, commentID, updatedComment) {
  let authTokens = JSON.parse(localStorage.getItem("authTokens"));
  // console.log(authTokens.access);

  const options = {
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
      Authorization: `Bearer ${authTokens.access}`,
    },
  };
  await axios.patch(
    `${BasePath}/posts/${postID}/comments/${commentID}`,
    {
      comment: updatedComment,
    },
    options
  );
  document.getElementById("written-comment-" + commentID).innerHTML =
    updatedComment;

  // handleCommentsMenuClose();
}

function Comment({ post, comment, userId, userName }) {
  const [anchorElComments, setAnchorElComments] = useState(null);
  // const [anchorComments, setAnchorComments] = useState(null);
  // const [commentSection, setCommentSection] = useState([]);
  const [open, setCommentEditOpen] = useState(false);

  const isCommentMenuOpen = Boolean(anchorElComments);
  // const isCommentsOpen = Boolean(expanded);

  const handleCommentsMenuOpen = (event) => {
    setAnchorElComments(event.currentTarget);
  };

  const handleCommentsMenuClose = () => {
    setAnchorElComments(null);
  };

  let menuIdComments = "primary-menu-comments";
  function renderMenuComments(postId, commentId) {
    const handleDelete = (popupState) => {
      deleteComment(postId, commentId);
      popupState.close();
    };

    const handleEdit = (popupState) => {
      console.log("I am here how many times I have");
      popupState.close();
      setCommentEditOpen(true);
    };

    return (
      <>
        <PopupState variant="popover">
          {(popupState) => (
            <React.Fragment>
              <IconButton
                variant="contained"
                {...bindTrigger(popupState)}
                aria-label="settings"
                //aria-controls={menuIdComments}
                //onClick={handleCommentsMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                {...bindMenu(popupState)}
                // anchorEl={anchorElComments}
                // anchorOrigin={{
                //   vertical: "top",
                //   horizontal: "right",
                // }}
                // id={menuIdComments}
                // keepMounted
                // transformOrigin={{
                //   vertical: "top",
                //   horizontal: "right",
                // }}
                //open={isCommentMenuOpen}
                //onClose={handleCommentsMenuClose}
              >
                <MenuItem onClick={() => handleEdit(popupState)}>
                  {" "}
                  Edit
                </MenuItem>
                <MenuItem onClick={() => handleDelete(popupState)}>
                  {" "}
                  Delete
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <EditComment
          open={open}
          setCommentEditOpen={setCommentEditOpen}
          postID={post.id}
          commentID={comment.id}
          comment={comment.comment}
        />
      </>
    );
  }

  // edit/delete comment
  async function deleteComment(postID, commentID) {
    let authTokens = JSON.parse(localStorage.getItem("authTokens"));
    // console.log(authTokens.access);

    const options = {
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
        Authorization: `Bearer ${authTokens.access}`,
      },
    };
    await axios.delete(
      `${BasePath}/posts/${postID}/comments/${commentID}`,
      options
    );
    console.log("comment", commentID);
    var elem = document.getElementById(commentID);

    elem.remove();
    handleCommentsMenuClose();
  }

  let { authTokens } = useContext(AuthContext);

  const options = {
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
      Authorization: `Bearer ${authTokens.access}`,
    },
  };

  return (
    <div key={comment.id} id={comment.id}>
      <Box
        sx={{
          padding: "10px",
        }}
      >
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={comment.author.profile_image_url} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>
              {comment.author.username}
            </h4>
            <p
              style={{ textAlign: "left" }}
              id={"written-comment-" + comment.id}
            >
              {comment.comment}
            </p>
            {/* <p style={{ textAlign: "left", color: "gray" }}>
            {comment.published}
            </p> */}
          </Grid>
          <IconButton
            aria-label="add to favorites"
            onClick={async () => {
              //checks current color (liked or not)
              console.log("in");
              var buttonColor = document.getElementById(
                comment.id + "-like-comment"
              ).style.color;
              if (buttonColor === "red") {
                // if liked, get the likes for the post, find the users, and delete it
                const res = await axios.get(
                  BasePath + `/posts/comments/${comment.id}/likes`,
                  options
                );
                const likeId = res.data.filter((x) => x.author.id === userId)[0]
                  .id;
                await axios.delete(
                  BasePath + `/posts/likes/${likeId}`,
                  options
                );

                // get current likes and decrement (faster then pinging backend, no need for refresh), change icon to grey

                if (
                  document.getElementById(comment.id + "-like-count-comment")
                    .innerHTML === "1"
                ) {
                  document.getElementById(
                    comment.id + "-like-count-comment"
                  ).innerHTML = " ";
                } else {
                  let count = parseInt(
                    document.getElementById(comment.id + "-like-count-comment")
                      .innerHTML
                  );
                  document.getElementById(
                    comment.id + "-like-count-comment"
                  ).innerHTML = count - 1;
                }

                document.getElementById(
                  comment.id + "-like-comment"
                ).style.color = "grey";
              } else {
                // create new like-post object
                await axios.post(
                  BasePath + `/posts/comments/${comment.id}/likes`,
                  {
                    summary: userName + " liked your comment.",
                    author: userId,
                  },
                  options
                );

                // get current likes and increment (faster then pinging backend, no need for refresh), change icon to red

                if (
                  document.getElementById(comment.id + "-like-count-comment")
                    .innerHTML === " "
                ) {
                  document.getElementById(
                    comment.id + "-like-count-comment"
                  ).innerHTML = 1;
                } else {
                  let count = parseInt(
                    document.getElementById(comment.id + "-like-count-comment")
                      .innerHTML
                  );
                  document.getElementById(
                    comment.id + "-like-count-comment"
                  ).innerHTML = count + 1;
                }

                document.getElementById(
                  comment.id + "-like-comment"
                ).style.color = "red";
              }
            }}
          >
            <FavoriteIcon id={comment.id + "-like-comment"} color="grey" />
            <h6 id={comment.id + "-like-count-comment"}> </h6>
          </IconButton>

          {/* like counter */}

          {userId === comment.author.id
            ? renderMenuComments(post.id, comment.id)
            : null}
        </Grid>
      </Box>
      <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
    </div>
  );
}

function RenderMenuPost({ post }) {
  var type = post.contentType;

  const [open, setOpen] = useState(false);
  // const [PostType, setType] = useState("");

  const handleDelete = (popupState) => {
    deletePost(post.id);
    popupState.close();
  };

  const handleEdit = (popupState) => {
    // add edit post function here
    console.log("I am here how many times I have");
    popupState.close();
    setOpen(true);
  };

  return (
    <>
      <PopupState variant="popover">
        {(popupState) => (
          <React.Fragment>
            <IconButton
              variant="contained"
              {...bindTrigger(popupState)}
              aria-label="settings"
              //aria-controls={menuIdPost}
              //onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => handleEdit(popupState)}> Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(popupState)}>
                {" "}
                Delete
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      <Posts
        postType={type}
        open={open}
        setOpen={setOpen}
        edit={true}
        post={post}
      />
    </>
  );
}

// deleting post
async function deletePost(postID) {
  let authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const options = {
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
      Authorization: `Bearer ${authTokens.access}`,
    },
  };

  await axios.delete(`${BasePath}/posts/${postID}/`, options);
  var elem = document.getElementById(postID);

  elem.remove();
  // handleMenuClose();
}

function CreateArray() {
  let { authTokens } = useContext(AuthContext);
  // console.log(authTokens.access);

  const options = {
    headers: {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
      Authorization: `Bearer ${authTokens.access}`,
    },
  };
  var { user } = useContext(AuthContext);
  const userId = user.user_id;
  const userName = user.username;
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [postList, setPostList] = useState([]);
  const [wasLast, setWasLast] = useState(false);

  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [menuId, setMenuId] = useState(0);
  const isMenuOpen = Boolean(anchorElMenu);

  const handleMenuOpen = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  // const handleCommentsOpen = (event) => {
  //   setExpanded(event.currentTarget);
  // };

  // const handleCommentsClose = () => {
  //   setExpanded(null);
  // };

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  var location = useLocation();

  const imgLink =
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

  let commentsId = "primary-comments-post";
  // const ExpandMore = styled((props) => {
  //   // anchorEl = {anchorComments}
  //   const { expand, ...other } = props;
  //   return <IconButton {...other}
  //   anchorEl = {expanded}
  //   id = {commentsId}
  //   open = {isCommentsOpen}
  //   onClose = {handleCommentsClose}
  //   />;
  // })(({ theme, expand }) => ({
  //   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  //   // marginLeft: 'auto',
  //   transition: theme.transitions.create("transform", {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  // }));

  // let renderComments = (
  //   <Collapse
  //     in={expanded}
  //     id={commentsId}
  //     // open={isCommentsOpen}
  //     // onClose={handleCommentsClose}
  //     timeout="auto"
  //     unmountOnExit
  //   >
  //     <CardContent>
  //       <Typography paragraph>
  //         <div>
  //           <h1>"THIS IS A TEST"</h1>
  //         </div>
  //       </Typography>
  //     </CardContent>
  //   </Collapse>
  // );

  // await axios.delete(`${BasePath}/posts/${post.id}/comments/${comment.id}`);
  // await axios.patch(`${BasePath}/posts/${post.id}/comments/${comment.id}`, {"comment":${editedComment}});

  useEffect(() => {
    const fetchComments = async () => {
      for (let i = postList.length - 5; i < postList.length; i++) {
        try {
          const res = await axios.get(
            `${BasePath}/posts/${postList[i].id}/comments?page=1&size=1000`,
            options
          );
          setComments((prevComments) => {
            const newComments = res.data.filter(
              (comment) => !prevComments.find((c) => c.id === comment.id)
            );
            return [...prevComments, ...newComments];
          });
        } catch (e) {
          if (e.response.status === 404) {
            console.log(`Post ${postList[i].id} has no comments`);
          } else {
            console.log(e.response.status);
          }
        }
      }
    };

    if (postList.length > 0 && !location.state) {
      fetchComments();
    }
  }, [postList]);

  useEffect(() => {
    if (location.state) {
      console.log("location.state is", location.state);
      const getData = async () => {
        const res = await axios.get(
          BasePath + "/posts/" + location.state + "/",
          options
        );

        if (!res.data.length) {
          setWasLast(true);
        }

        setPostList([res.data]);
        try {
          const commentsRes = await axios.get(
            `${BasePath}/posts/${location.state}/comments?page=1&size=1000`,
            { Authorization: `Bearer ${authTokens.access}` }
          );
          setComments((prevComments) => {
            const newComments = commentsRes.data.filter(
              (comment) => !prevComments.find((c) => c.id === comment.id)
            );
            return [...prevComments, ...newComments];
          });
        } catch (e) {
          if (e.response.status === 404) {
            console.log(`Post ${location.state} has no comments`);
          } else {
            console.log(e.response.status);
          }
        }

        const likesRes = await axios.get(
          `${BasePath}/posts/${location.state}/likes`,
          options
        );

        for (let each in likesRes.data) {
          if (likesRes.data[each].author.id === userId) {
            document.getElementById(location.state + "-like").style.color =
              "red";
          }
        }
        document.getElementById(location.state + "-like-count").innerText =
          likesRes.data.length;

        location.state = null;
      };

      async function commLikes() {
        if (comments.length > 0) {
          for (let i = 0; i < comments.length; i++) {
            try {
              const likesRes = await axios.get(
                BasePath + `/posts/comments/${comments[i].id}/likes`,
                options
              );

              for (let each in likesRes.data) {
                if (likesRes.data[each].author.id === userId) {
                  document.getElementById(
                    comments[i].id + "-like-comment"
                  ).style.color = "red";
                }
              }
              document.getElementById(
                comments[i].id + "-like-count-comment"
              ).innerText = likesRes.data.length;
            } catch (e) {
              if (e.response.status === 404) {
                console.log(`Comment ${comments[i].id} has no likes`);
              } else {
                console.log(e.response.status);
              }
            }
          }
        }
      }

      getData();
      commLikes();

      window.history.replaceState({}, document.title);
    } else {
      const getData = async () => {
        const res = await axios.get(
          BasePath +
            `/posts/author/` +
            user.user_id +
            `?page=${currPage}&size=5`,
          options
        );

        if (!res.data.length) {
          setWasLast(true);
        }
        setPrevPage(currPage);
        setPostList([...postList, ...res.data]);
      };

      if (!wasLast && prevPage !== currPage && !location.state) {
        getData();
      }
    }
  }, [currPage, prevPage, wasLast, postList]);

  useEffect(() => {
    const onScroll = () => {
      // console.log((window.innerHeight), ((window.innerHeight) * 2), window.scrollY, document.body.offsetHeight)
      setOffset(window.pageYOffset);
      if (
        window.innerHeight + 10 + window.scrollY >=
        document.body.offsetHeight
      ) {
        setCurrPage(currPage + 1);
      }
    };
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  function getImg(post) {
    if (!post.image_url) {
      return post.image_file ? (
        <Box
          sx={{
            width: "100%",
            // height: "px",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              // height: "50vh",

              // backgroundPosition: "center",
              // backgroundRepeat: "no-repeat",
              // backgroundSize: "cover",
            }}
            image={BasePath + post.image_file}
            alt={post.description}
          />
        </Box>
      ) : null;
    } else {
      return (
        <Box
          sx={{
            width: "100%",
            // height: "px",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              // height: "50vh",

              // backgroundPosition: "center",
              // backgroundRepeat: "no-repeat",
              // backgroundSize: "cover",
            }}
            image={post.image_url}
            alt={post.description}
          />
        </Box>
      );
    }
  }
  function renderMarkdown(post) {
    if (post.contentType === "text/markdown") {
      // var test = "`" + post.body + "`";
      // console.log(test);
      // console.log(post.body === markdown)
      // const markdown = post.body;
      return <ReactMarkdown>{post.body}</ReactMarkdown>;
    } else {
      return (
        <Typography variant="h5" color="black">
          {post.body}
        </Typography>
      );
    }
  }

  useEffect(() => {
    async function checkLike() {
      if (postList.length > 0) {
        for (let i = postList.length - 5; i < postList.length; i++) {
          try {
            const res = await axios.get(
              BasePath + `/posts/${postList[i].id}/likes`,
              options
            );

            for (let each in res.data) {
              if (res.data[each].author.id === userId) {
                document.getElementById(postList[i].id + "-like").style.color =
                  "red";
              }
            }
            document.getElementById(postList[i].id + "-like-count").innerText =
              res.data.length;
          } catch (e) {
            if (e.response.status === 404) {
              console.log(`Post ${postList[i].id} has no likes`);
            } else {
              console.log(e.response.status);
            }
          }
        }
      }

      if (comments.length > 0) {
        for (let i = 0; i < comments.length; i++) {
          try {
            const res = await axios.get(
              BasePath + `/posts/comments/${comments[i].id}/likes`,
              options
            );

            for (let each in res.data) {
              if (res.data[each].author.id === userId) {
                document.getElementById(
                  comments[i].id + "-like-comment"
                ).style.color = "red";
              }
            }
            document.getElementById(
              comments[i].id + "-like-count-comment"
            ).innerText = res.data.length;
          } catch (e) {
            if (e.response.status === 404) {
              console.log(`Comment ${comments[i].id} has no likes`);
            } else {
              console.log(e.response.status);
            }
          }
        }
      }
    }
    if (!location.state) {
      checkLike();
    }
  }, [currPage, prevPage, wasLast, postList, userId, comments]);

  const onAddComment = (newComment) => {
    const allComments = [newComment, ...comments];
    console.log("New Comment", newComment, allComments);
    setComments(allComments);
  };

  const listItems = postList.map((post) => (
    <div key={post.id} id={post.id}>
      <Box
        sx={{
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
        className={post.id}
      >
        <Container maxWidth="sm">
          <Card sx={{ maxWidth: 700 }} className={post.author}>
            <CardHeader
              avatar={
                <Avatar
                  src={post.author_image_url}
                  sx={{}}
                  aria-label="recipe"
                ></Avatar>
              }
              action={
                userId === post.author_id ? (
                  <RenderMenuPost post={post} />
                ) : null
              }
              title={post.title + " - " + post.author_name}
              subheader={format(new Date(post.datePublished), "MMMM d, yyyy")}
            />
            {getImg(post)}
            <CardContent>
              {getImg(post) === null ? (
                renderMarkdown(post)
              ) : (
                <Typography variant="h6" color="text.secondary">
                  {post.body}
                </Typography>
              )}
            </CardContent>
            <CardActions disableSpacing>
              {/* button for liking posts */}
              <IconButton
                aria-label="add to favorites"
                onClick={async () => {
                  //checks current color (liked or not)
                  var buttonColor = document.getElementById(post.id + "-like")
                    .style.color;
                  if (buttonColor === "red") {
                    // if liked, get the likes for the post, find the users, and delete it
                    const res = await axios.get(
                      BasePath + `/posts/${post.id}/likes`,
                      options
                    );
                    const likeId = res.data.filter(
                      (x) => x.author.id === userId
                    )[0].id;
                    await axios.delete(
                      BasePath + `/posts/likes/${likeId}`,
                      options
                    );

                    // get current likes and decrement (no need for refresh or re-ping backend), change icon to grey

                    if (
                      document.getElementById(post.id + "-like-count")
                        .innerHTML === "1"
                    ) {
                      document.getElementById(
                        post.id + "-like-count"
                      ).innerHTML = "No likes yet";
                    } else {
                      let count = parseInt(
                        document.getElementById(post.id + "-like-count")
                          .innerHTML
                      );
                      document.getElementById(
                        post.id + "-like-count"
                      ).innerHTML = count - 1;
                    }

                    document.getElementById(post.id + "-like").style.color =
                      "grey";
                  } else {
                    // create new like-post object
                    await axios.post(
                      BasePath + `/posts/${post.id}/likes`,
                      {
                        summary: userName + " liked your post.",
                        author: userId,
                      },
                      options
                    );

                    // get current likes and increment (no need for refresh or re-ping backend), change icon to red

                    if (
                      document.getElementById(post.id + "-like-count")
                        .innerHTML === "No likes yet"
                    ) {
                      document.getElementById(
                        post.id + "-like-count"
                      ).innerHTML = 1;
                    } else {
                      let count = parseInt(
                        document.getElementById(post.id + "-like-count")
                          .innerHTML
                      );
                      document.getElementById(
                        post.id + "-like-count"
                      ).innerHTML = count + 1;
                    }

                    document.getElementById(post.id + "-like").style.color =
                      "red";
                  }
                }}
              >
                <FavoriteIcon id={post.id + "-like"} color="grey" />
              </IconButton>

              {/* like counter */}
              <h5 id={post.id + "-like-count"}>No likes yet</h5>

              {/* <IconButton 
        aria-label="comments"
        aria-controls={commentsId}
        onClick={handleCommentsOpen}
        >
          <Comments />
          </IconButton> */}
              {/* <ExpandMore
          expand={expanded}
          onClick={handleCommentsOpen}
          aria-expanded={expanded}
          aria-controls={commentsId}
          aria-label="show more"
        >
          <Comments />
        </ExpandMore> */}
            </CardActions>
            {/* https://stackoverflow.com/questions/43788878/scrollable-list-component-from-material-ui-in-react */}
            {/* https://codesandbox.io/s/comment-box-with-material-ui-10p3c?file=/src/index.js:153-285 */}
            <div style={{ padding: 14 }}>
              <h3 style={{ padding: 10 }}>Comments</h3>
              {/* {() => {
        for (let i = 0; i < comments.length; i++) {
          console.log(comments[i].id)
        }
      }} */}
              <Paper
                style={{ maxHeight: 400, overflow: "auto" }}
                id={"post-comments-" + post.id}
                key={post.id}
              >
                {comments
                  .filter((x) => x.post === post.id)
                  .map((comment) => (
                    <div key={comment.id}>
                      <Comment
                        post={post}
                        comment={comment}
                        userId={userId}
                        userName={userName}
                      />
                    </div>
                  ))}
              </Paper>
            </div>
            <CommentBox
              pid={post.id}
              userId={userId}
              onAddComment={onAddComment}
            />
          </Card>
        </Container>
      </Box>
    </div>
  ));

  return <div>{listItems}</div>;
}

const ProfilePage = () => {
  let { user } = useContext(AuthContext);
  let [url, setUrl] = useState();
  const [open, setOpen] = useState(false);

  function openUploadProfile() {
    setOpen(true);
  }

  const authTokens = JSON.parse(localStorage.getItem("authTokens"));

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${authTokens.access}`,
  };

  // https://stackoverflow.com/questions/69078642/how-use-get-method-in-react-js
  let profile_image_url = async () => {
    let response = await fetch(BasePath + "/author/" + user.user_id + "/", {
      method: "GET",
      headers: headers,
    });
    response.json().then((response) => setUrl(response.profile_image_url));
  };

  useEffect(() => {
    profile_image_url();
  }, []);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          paddingTop: "30px",
          marginTop: "3em",
        }}
      >
        <Container maxWidth="md">
          <Card>
            <CardContent>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={url}
                  alt="profile-image"
                  sx={{
                    height: 64,
                    mb: 2,
                    width: 64,
                  }}
                />
                <Typography color="textPrimary" gutterBottom variant="h5">
                  {user.username}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {user.email}
                </Typography>
              </Box>
            </CardContent>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container
                maxWidth="md"
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                }}
              >
                <Grid container spacing={4}>
                  <Grid item lg={4} md={6} xs={12}>
                    <a
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onMouseOver={(e) => (
                        (e.target.style.color = "blue"),
                        (e.target.style.cursor = "pointer"),
                        (e.target.style.textDecoration = "underline")
                      )}
                      onMouseOut={(e) => (
                        (e.target.style.color = "black"),
                        (e.target.style.textDecoration = "none")
                      )}
                      href="/Followers"
                    >
                      Followers
                    </a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onMouseOver={(e) => (
                        (e.target.style.color = "blue"),
                        (e.target.style.cursor = "pointer"),
                        (e.target.style.textDecoration = "underline")
                      )}
                      onMouseOut={(e) => (
                        (e.target.style.color = "black"),
                        (e.target.style.textDecoration = "none")
                      )}
                      href="/Following"
                    >
                      Following
                    </a>
                  </Grid>
                  <Grid item lg={4} md={6} xs={12}>
                    <a
                      style={{
                        color: "black",
                        fontSize: "16px",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onMouseOver={(e) => (
                        (e.target.style.color = "blue"),
                        (e.target.style.cursor = "pointer"),
                        (e.target.style.textDecoration = "underline")
                      )}
                      onMouseOut={(e) => (
                        (e.target.style.color = "black"),
                        (e.target.style.textDecoration = "none")
                      )}
                      href="/TrueFriends"
                    >
                      True Friends
                    </a>
                  </Grid>
                </Grid>
              </Container>
            </Box>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                fullWidth
                variant="text"
                onClick={() => openUploadProfile()}
              >
                Upload picture
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          paddingTop: "100px",
          // paddingBottom: "30px",
        }}
      >
        <CreateArray />
      </Box>
      <EditProfile open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProfilePage;
