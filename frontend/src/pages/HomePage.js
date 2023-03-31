/* eslint-disable no-lone-blocks */
import { Card, Box, Container, Menu, MenuItem, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import BasePath from "../config/BasePath";
import * as React from "react";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Comments from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format, set } from "date-fns";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Divider, Grid, Paper, Button } from "@mui/material";
import ReactMarkdown from "react-markdown";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// async function addComment(userId, postId, comment) {
//   console.log(postId);
//   const authTokens = JSON.parse(localStorage.getItem("authTokens"));
//   console.log(authTokens.access);

//   const header = {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + authTokens.access,
//   };

//   await axios.post(
//     BasePath + `/posts/` + postId + "/comments",
//     {
//       author: userId,
//       comment: comment,
//       contentType: "text/plain",
//     },
//     header
//   );
//   var paper = document.getElementById("post-comments-" + postId);
//   document.createElement("div");
//   paper.prependChild(document.createTextNode("hello"));
//   //document.location.reload(true);
// }

async function addComment(userId, postId, comment) {
  console.log(postId);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  console.log(authTokens.access);

  const headers = {
    "Content-Type": "application/json",
    // Authorization: "Bearer " + authTokens.access,
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

function Comment({ post, comment, userId, userName }) {
  const [anchorElComments, setAnchorElComments] = useState(null);
  // const [anchorComments, setAnchorComments] = useState(null);
  // const [commentSection, setCommentSection] = useState([]);

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
      // add edit comment function here

      popupState.close();
    };

    return (
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
              <MenuItem onClick={() => handleEdit(popupState)}> Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(popupState)}>
                {" "}
                Delete
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }

  function close() {
    console.log("1", anchorElComments);
    handleCommentsMenuClose();
    setAnchorElComments(null);
    console.log("2", anchorElComments);
  }
  // edit/delete comment
  async function deleteComment(postID, commentID) {
    await axios.delete(`${BasePath}/posts/${postID}/comments/${commentID}`);
    console.log("comment", commentID);
    var elem = document.getElementById(commentID);

    elem.remove();
    handleCommentsMenuClose();
  }

  async function editComment(postID, commentID, updatedComment) {
    await axios.patch(`${BasePath}/posts/${postID}/comments/${commentID}`, {
      comment: updatedComment,
    });
    document.getElementById("written-comment-" + commentID).innerHTML =
      updatedComment;

    handleCommentsMenuClose();
  }

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
              var buttonColor = document.getElementById(
                comment.id + "-like-comment"
              ).style.color;
              if (buttonColor === "red") {
                // if liked, get the likes for the post, find the users, and delete it
                const res = await axios.get(
                  BasePath + `/posts/comments/${comment.id}/likes`
                );
                const likeId = res.data.filter((x) => x.author.id === userId)[0]
                  .id;
                await axios.delete(BasePath + `/posts/likes/${likeId}`);

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
                  {
                    "Content-Type": "application/json",
                  }
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

function CreateArray() {
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

  const markdown = `**Just** a link: [https://reactjs.com](https://reactjs.com.)`;

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

  let menuIdPost = "primary-menu-post";
  function renderMenuPost(postId) {
    const handleDelete = (popupState) => {
      deletePost(postId);
      popupState.close();
    };

    const handleEdit = (popupState) => {
      // add edit post function here

      popupState.close();
    };

    return (
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

            <Menu
              {...bindMenu(popupState)}
              // anchorEl={anchorElMenu}
              // anchorOrigin={{
              //   vertical: "top",
              //   horizontal: "right",
              // }}
              // id={menuIdPost}
              // keepMounted
              // transformOrigin={{
              //   vertical: "top",
              //   horizontal: "right",
              // }}
              // open={isMenuOpen}
              // onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEdit(popupState)}> Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(popupState)}>
                {" "}
                Delete
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }

  // deleting post
  async function deletePost(postID) {
    await axios.delete(`${BasePath}/posts/${postID}/`);
    var elem = document.getElementById(postID);

    elem.remove();
    handleMenuClose();
  }

  // await axios.delete(`${BasePath}/posts/${post.id}/comments/${comment.id}`);
  // await axios.patch(`${BasePath}/posts/${post.id}/comments/${comment.id}`, {"comment":${editedComment}});

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "X-PAGINATION-SIZE",
  };
  useEffect(() => {
    const fetchComments = async () => {
      for (let i = postList.length - 5; i < postList.length; i++) {
        try {
          const res = await axios.get(
            `${BasePath}/posts/${postList[i].id}/comments?page=1&size=1000`
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

    if (postList.length > 0) {
      fetchComments();
    }
  }, [postList]);

  useEffect(() => {
    if (location.state) {
      console.log("location.state is", location.state);
      const getData = async () => {
        const res = await axios.get(
          BasePath + "/posts/" + location.state + "/",
          headers
        );

        if (!res.data.length) {
          setWasLast(true);
        }

        setPostList([res.data]);
        location.state = null;
      };
      getData();
      window.history.replaceState({}, document.title);
    } else {
      const getData = async () => {
        const res = await axios.get(
          BasePath + `/posts/all/?page=${currPage}&size=5`,
          headers
        );

        if (!res.data.length) {
          setWasLast(true);
        }
        setPrevPage(currPage);
        setPostList([...postList, ...res.data]);
      };

      if (!wasLast && prevPage !== currPage) {
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
              BasePath + `/posts/${postList[i].id}/likes`
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
              BasePath + `/posts/comments/${comments[i].id}/likes`
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

    checkLike();
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
                userId === post.author_id ? renderMenuPost(post.id) : null
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
                      BasePath + `/posts/${post.id}/likes`
                    );
                    const likeId = res.data.filter(
                      (x) => x.author.id === userId
                    )[0].id;
                    await axios.delete(BasePath + `/posts/likes/${likeId}`);

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
                      {
                        "Content-Type": "application/json",
                      }
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
              <body1 id={post.id + "-like-count"}>No likes yet</body1>

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

const HomePage = (props) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          paddingTop: "100px",
          paddingBottom: "30px",
        }}
      >
        <CreateArray />
      </Box>
    </div>
  );
};

export default HomePage;
