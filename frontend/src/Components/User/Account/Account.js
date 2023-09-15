import React, { useEffect, useState } from "react";
import "./account.css";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Post from "../../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  clearMessage,
  fetchAllPosts,
  fetchMyPosts,
} from "../../../Actions/PostActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader/Loader";

import CloseIcon from "@mui/icons-material/Close";
import UserDetails from "../UserDetails/UserDetails";
import {
  allUserDetails,
  blockList,
  getUserDetails,
  logout,
} from "../../../Actions/UserActions";
import axios from "axios";

function Account() {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);

  const { blockedUsers } = useSelector((state) => state.blockList);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [followersToggle, setFollowersToggle] = useState(false);

  const [followingToggle, setFollowingToggle] = useState(false);
  const [blockToggle, setBlockToggle] = useState(false);
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
    dispatch(blockList());
  }, [dispatch]);

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        "https://sharewave.vercel.app/user/deleteMe",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          data: { userId: user._id }, // Include the user ID in the request body
        }
      );
      const data = res.data;
      if (res.status === 200 && data.success) {
        const token = data.token;
        // Delete token from local storage
        localStorage.removeItem("token", token);
        // Delete token from cookies

        document.cookie =
          "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success(data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    dispatch(fetchMyPosts());
    dispatch(getUserDetails());
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  const handleUnblockUser = async (id) => {
    try {
      const response = await axios.post(
        `https://sharewave.vercel.app/user/unblock/${id}`,
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
        window.location.reload(true);
        await dispatch(fetchAllPosts());
        await dispatch(allUserDetails());
        await dispatch(blockList());
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
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, dispatch, likeError, message]);
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
                  isAccount={true}
                  isDelete={true}
                />
              )
          )
        ) : (
          <Typography
            variant="h6"
            style={{ marginTop: "40px", backgroundColor: "black" }}
          >
            No posts yet
          </Typography>
        )}
      </div>
      <div className="accountright">
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
          <button onClick={() => setBlockToggle(!blockToggle)}>
            <Typography>Blocking</Typography>
          </button>
          <Typography>{user?.user?.blockedUsers?.length}</Typography>
        </div>
        <div>
          <Typography>Posts</Typography>
          <Typography>{user?.user?.posts?.length}</Typography>

          <Link to="/update/profile" className="link">
            Edit Profile
          </Link>
          <Link to="/update/password" className="link">
            Change Password
          </Link>
          <Button
            variant="text"
            style={{ color: "blue", margin: "2vmax" }}
            onClick={logoutHandler}
          >
            Logout
          </Button>
          <Button
            variant="text"
            style={{ color: "red", margin: "1vmax" }}
            disabled={deleteLoading}
            onClick={handleDeleteAccount}
          >
            Delete My Profile
          </Button>
          <Dialog
            open={followersToggle}
            onClose={() => setFollowersToggle(!followersToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Followers</Typography>

              {user?.user?.followers?.length > 0 ? (
                user?.user?.followers.map((follower) => (
                  <UserDetails
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You have no followers
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
                user?.user?.following.map((follow) => (
                  <UserDetails
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={follow.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You're not following anyone
                </Typography>
              )}
            </div>
          </Dialog>

          <Dialog
            open={blockToggle}
            onClose={() => setBlockToggle(!blockToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Blocking</Typography>

              {blockedUsers && blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                  <div
                    key={user._id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <UserDetails
                      key={user._id}
                      userId={user._id}
                      name={user.name}
                      avatar={user.avatar ? user.avatar.url : null}
                    />
                    <Button
                      style={{ marginLeft: "150px" }}
                      onClick={() => handleUnblockUser(user._id)}
                    >
                      Unblock
                    </Button>
                  </div>
                ))
              ) : (
                <Typography>No Users Yet</Typography>
              )}
            </div>
          </Dialog>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Account;
