import React, { useEffect, useState } from "react";
import "../Account/account.css";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  clearMessage,
  fetchAllPosts,
  fetchUSERPosts,
} from "../../../Actions/PostActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader/Loader";

import CloseIcon from "@mui/icons-material/Close";
import UserDetails from "../UserDetails/UserDetails";

import {
  allUserDetails,
  fetchUSERProfile,
  followUser,
} from "../../../Actions/UserActions";
import axios from "axios";

function UserProfile() {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.userProfile);

  const { user: me } = useSelector((state) => state.user);

  const { error: likeError, message } = useSelector((state) => state.like);

  const {
    error: followError,
    success,
    loading: followLoading,
  } = useSelector((state) => state.follow);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [followersToggle, setFollowersToggle] = useState(false);

  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const params = useParams();

  const followHandler = async () => {
    setFollowing(!following);
    const followKey = `followStatus_${user?.user?._id}`;
    if (!following) {
      // Follow the user and set the follow status in local storage
      setFollowing(true);
      await dispatch(followUser(user?.user?._id));
      await dispatch(fetchUSERProfile(params.id));

      localStorage.setItem(followKey, true);
    } else {
      // Unfollow the user and remove the follow status from local storage
      setFollowing(false);
      await dispatch(followUser(user?.user?._id)); // You should have an unfollow action
      await dispatch(fetchUSERProfile(params.id));
      localStorage.removeItem(followKey);
    }
  };

  useEffect(() => {
    const followKey = `followStatus_${params.id}`;
    // Check if the follow status is saved in local storage
    const storedFollowStatus = localStorage.getItem(followKey);

    // If the follow status exists in local storage, set the initial state
    if (storedFollowStatus) {
      setFollowing(storedFollowStatus === "true");
    }

    // Other useEffect logic...
  }, [params.id]);

  const navigate = useNavigate();

  const toggleFullscreen = () => {
    setIsFullscreen(true);
  };
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      closeFullscreen();
    }
  };

  useEffect(() => {
    dispatch(fetchUSERPosts(params.id));
    dispatch(fetchUSERProfile(params.id));

    if (me?._id === params.id) {
      setMyProfile(true);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, params.id, me?._id]);

  const handleBlockUser = async (id) => {
    try {
      const response = await axios.post(
        `https://sharewave.vercel.app/user/block/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/");
        await dispatch(fetchAllPosts());
        await dispatch(allUserDetails());
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (likeError) {
      toast.error(likeError); // Use the "error" variable instead of "message"
      dispatch(clearErrors()); // Call the clearErrors action creator as a function
    }

    if (followError) {
      toast.error(followError);
      dispatch(clearErrors());
    }

    if (userError) {
      toast.error(userError);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }

    if (success) {
      dispatch(fetchUSERProfile(params.id));
      toast.success("User Followed");
    }
  }, [error, dispatch, likeError, message, userError, followError]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map(
            (post) =>
              // Check if post exists before accessing its properties
              post && (
                <Post
                  key={post._id}
                  postId={post._id}
                  caption={post.caption}
                  postImage={post.image ? post.image.map((img) => img.url) : []}
                  tags={post.tags ? post.tags : null}
                  location={post.location ? post.location : null}
                  feeling={post.feeling ? post.feeling : null}
                  likes={post.likes}
                  comments={post.comments}
                  ownerImage={
                    post.owner && post.owner.avatar
                      ? post.owner.avatar.url
                      : null
                  }
                  ownerName={
                    post.owner && post.owner.name ? post.owner.name : null
                  }
                  ownerId={post.owner && post.owner._id ? post.owner._id : null}
                  createdAt={post.createdAt}
                />
              )
          )
        ) : (
          <Typography
            variant="h6"
            style={{ marginTop: "40px", backgroundColor: "black" }}
          >
            User has not made any posts yet
          </Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <>
            {isFullscreen && (
              <div
                className="fullScreen"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 200,
                  bottom: 0,
                  zIndex: 10,
                }}
              >
                <Avatar
                  src={user?.user?.avatar?.url}
                  onClose={closeFullscreen}
                  style={{
                    width: "80%",
                    height: "100%",
                    borderRadius: "0%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 0,
                    left: 650,
                  }}
                >
                  <CloseIcon
                    onClick={closeFullscreen}
                    style={{ cursor: "pointer", fontSize: 60 }}
                  />
                </div>
              </div>
            )}

            <Avatar
              src={user?.user?.avatar?.url}
              alt="User Avatar"
              onClick={toggleFullscreen}
              style={{ height: "8vmax", width: "8vmax", cursor: "pointer" }}
            />
            <Typography variant="h5">{user?.user?.name}</Typography>
            <Typography variant="h7" style={{ textDecoration: "underline" }}>
              <a
                href={user?.user?.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user?.user?.website}
              </a>
            </Typography>
            <div>
              <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers</Typography>
              </button>
              <Typography>{user?.user?.followers?.length}</Typography>
            </div>

            <div>
              <button onClick={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following</Typography>
              </button>
              <Typography>{user?.user?.following?.length}</Typography>
            </div>
            <div>
              <Typography>Posts</Typography>
              <Typography>{user?.user?.posts?.length}</Typography>
            </div>

            {myProfile ? null : (
              <Button
                variant="text"
                style={{ color: following ? "red" : "blue" }}
                onClick={followHandler}
                disabled={followLoading}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}

            <Button
              variant="text"
              style={{ color: "blue", margin: "2vmax" }}
              onClick={() => handleBlockUser(params.id)}
            >
              Block
            </Button>
          </>
        )}

        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>

            {user?.user?.followers?.length > 0 ? (
              user.user.followers.map((follower) => (
                <UserDetails
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                {user?.user?.name} does not have any followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>

            {user?.user?.following?.length > 0 ? (
              user.user.following.map((follow) => (
                <UserDetails
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                {user?.user?.name} is not following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>

      <ToastContainer />
    </div>
  );
}

export default UserProfile;
