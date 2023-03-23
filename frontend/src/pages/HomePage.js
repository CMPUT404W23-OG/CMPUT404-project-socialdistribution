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

async function addComment(userId, postId, comment) {
  console.log(postId);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  console.log(authTokens.access);

  const header = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authTokens.access,
  };

  await axios.post(
    BasePath + `/posts/` + postId + "/comments",
    {
      author: userId,
      comment: comment,
      contentType: "text/plain",
    },
    header
  );
  // document.location.reload(true);
}

function CommentBox({ userId, pid }) {
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
            addComment(userId, pid, comment);
            setComment("");
          }}
        >
          Add
        </Button>
      </Box>
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
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const markdown = `**Just** a link: [https://reactjs.com](https://reactjs.com.)`;
  // const [anchorComments, setAnchorComments] = useState(null);
  const [menuId, setMenuId] = useState(0);
  // const [commentSection, setCommentSection] = useState([]);

  const isMenuOpen = Boolean(anchorElMenu);
  // const isCommentsOpen = Boolean(expanded);

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
  const renderMenuPost = (
    <Menu
      anchorEl={anchorElMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuIdPost}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem> Edit</MenuItem>
      <MenuItem> Delete</MenuItem>
    </Menu>
  );

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

  // useEffect(() => {
  //   if (postList.length > 0) {

  //     for (let i = (postList.length - 5); i < postList.length; i++) {
  //       const getData = () => {
  //         Promise.all([
  //             fetch(BasePath + `/posts/${postList[i].id}/comments`, {
  //               method: "GET",
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Accept: "application/json",
  //               }
  //             })
  //         ])
  //         .then(([commentsResponse]) =>
  //           Promise.all([commentsResponse.json()]))
  //           .then(([commentsData]) => {
  //             console.log('data', commentsData);
  //             setComments([...comments, commentsData])})

  //       };

  //       getData();
  //       console.log("comments", comments)
  //     }
  //   }
  // }, [postList]);

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

  const listItems = postList.map((post) => (
    <Box
      key={post.id}
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
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
            }
            action={
              userId === post.author_id ? (
                <IconButton
                  aria-label="settings"
                  aria-controls={menuIdPost}
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
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
                    document.getElementById(post.id + "-like-count").innerHTML =
                      "No likes yet";
                  } else {
                    let count = parseInt(
                      document.getElementById(post.id + "-like-count").innerHTML
                    );
                    document.getElementById(post.id + "-like-count").innerHTML =
                      count - 1;
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
                      document.getElementById(post.id + "-like-count").innerHTML
                    );
                    document.getElementById(post.id + "-like-count").innerHTML =
                      count + 1;
                  }

                  document.getElementById(post.id + "-like").style.color =
                    "red";
                }
              }}
            >
              <FavoriteIcon id={post.id + "-like"} color="grey" />
            </IconButton>

            {/* like counter */}
            <h3 id={post.id + "-like-count"}>No likes yet</h3>

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
            <Paper style={{ maxHeight: 400, overflow: "auto" }}>
              {comments
                .filter((x) => x.post === post.id)
                .map((comment) => {
                  return (
                    <div key={comment.id}>
                      <Box
                        sx={{
                          padding: "10px",
                        }}
                      >
                        <Grid container wrap="nowrap" spacing={2}>
                          <Grid item>
                            <Avatar
                              alt="Remy Sharp"
                              src={comment.author.profile_image_url}
                            />
                          </Grid>
                          <Grid justifyContent="left" item xs zeroMinWidth>
                            <h4 style={{ margin: 0, textAlign: "left" }}>
                              {comment.author.username}
                            </h4>
                            <p style={{ textAlign: "left" }}>
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
                                  BasePath +
                                    `/posts/comments/${comment.id}/likes`
                                );
                                const likeId = res.data.filter(
                                  (x) => x.author.id === userId
                                )[0].id;
                                await axios.delete(
                                  BasePath + `/posts/likes/${likeId}`
                                );

                                // get current likes and decrement (faster then pinging backend, no need for refresh), change icon to grey

                                if (
                                  document.getElementById(
                                    comment.id + "-like-count-comment"
                                  ).innerHTML === "1"
                                ) {
                                  document.getElementById(
                                    comment.id + "-like-count-comment"
                                  ).innerHTML = " ";
                                } else {
                                  let count = parseInt(
                                    document.getElementById(
                                      comment.id + "-like-count-comment"
                                    ).innerHTML
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
                                  BasePath +
                                    `/posts/comments/${comment.id}/likes`,
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
                                  document.getElementById(
                                    comment.id + "-like-count-comment"
                                  ).innerHTML === " "
                                ) {
                                  document.getElementById(
                                    comment.id + "-like-count-comment"
                                  ).innerHTML = 1;
                                } else {
                                  let count = parseInt(
                                    document.getElementById(
                                      comment.id + "-like-count-comment"
                                    ).innerHTML
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
                            <FavoriteIcon
                              id={comment.id + "-like-comment"}
                              color="grey"
                            />
                            <h5 id={comment.id + "-like-count-comment"}> </h5>
                          </IconButton>

                          {/* like counter */}

                          {userId === comment.author.id ? (
                            <IconButton
                              aria-label="settings"
                              aria-controls={menuIdPost}
                              onClick={handleMenuOpen}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          ) : null}
                        </Grid>
                      </Box>
                      <Divider
                        variant="fullWidth"
                        style={{ margin: "30px 0" }}
                      />
                    </div>
                  );
                })}
            </Paper>
          </div>
          <CommentBox pid={post.id} userId={userId} />
        </Card>
      </Container>
      {renderMenuPost}
    </Box>
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
