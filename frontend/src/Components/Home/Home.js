import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  clearMessage,
  fetchAllPosts,
  fetchStoryPosts,
} from "../../Actions/PostActions";
import "./home.css";
import UserDetails from "../User/UserDetails/UserDetails";
import Post from "../Post/Post";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";
import { allUserDetails } from "../../Actions/UserActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import FetchStory from "../Post/Story/All Story/FetchStory";

function Home() {
  const dispatch = useDispatch();
  const { loading, posts, error } = useSelector((state) => state.posts);
  const { sanitizedUsers, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );

  const { stories } = useSelector((state) => state.allStory);

  const { error: likeError, message } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(fetchAllPosts());
    dispatch(allUserDetails());
    dispatch(fetchStoryPosts());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (likeError) {
      toast.error(likeError); // Use the "error" variable instead of "message"
      dispatch(clearErrors()); // Call the clearErrors action creator as a function
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [dispatch, error, message, likeError]);

  return loading === true || usersLoading === true ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
        {stories && stories.length > 0 ? (
          <FetchStory stories={stories} />
        ) : (
          <Typography variant="h6">No stories yet</Typography>
        )}

        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image ? post.image.map((img) => img.url) : null}
              tags={post.tags ? post.tags : null}
              location={post.location ? post.location : null}
              feeling={post.feeling ? post.feeling : null}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner?.avatar?.url}
              ownerName={post.owner?.name}
              ownerId={post.owner?._id}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <Typography variant="h6">No posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {sanitizedUsers && sanitizedUsers.length > 0 ? (
          sanitizedUsers.map((user) => (
            <motion.div
              key={user._id}
              initial={{ y: -1000 }}
              animate={{ x: -1, y: 1 }}
              transition={{ duration: 5 }}
            >
              <UserDetails
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar ? user.avatar.url : null}
              />
            </motion.div>
          ))
        ) : (
          <Typography>No Users Yet</Typography>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
