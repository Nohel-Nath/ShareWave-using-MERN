import React, { useEffect, useState } from "react";
import "./post.css";
import { Avatar, Button, Typography, Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  fetchAllPosts,
  fetchMyPosts,
  likePosts,
  postComment,
  updatePost,
} from "../../Actions/PostActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BiHappy, BiSad, BiAngry } from "react-icons/bi";
import { FaRegGrinStars } from "react-icons/fa";
import { BiHappyHeartEyes } from "react-icons/bi";
import { TbMoodBoy, TbMoodCrazyHappy } from "react-icons/tb";
import { BiCool } from "react-icons/bi";
import { ImCancelCircle, ImHappy } from "react-icons/im";
import { TfiFaceSmile } from "react-icons/tfi";
import UserDetails from "../User/UserDetails/UserDetails";
import CommentCard from "./CommentCard";
import CloseIcon from "@mui/icons-material/Close";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FiEdit2 } from "react-icons/fi";
import { getUserDetails } from "../../Actions/UserActions";

function Post({
  userId,
  postId,
  caption,
  tags = [],
  location,
  postImage = [],
  likes = [],
  feeling = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  createdAt,
  isDelete = false,
  isAccount = false,
}) {
  const { user } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
  const [editing, setEditing] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const [tagsValue, setTagsValue] = useState(tags);
  const [locationValue, setLocationValue] = useState(location);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const dispatch = useDispatch();

  const getFeelingIcon = (feeling) => {
    const iconSize = 22;
    switch (feeling) {
      case "happy":
        return <BiHappy fontSize={iconSize} />;
      case "sad":
        return <BiSad fontSize={iconSize} />;
      case "angry":
        return <BiAngry fontSize={iconSize} />;
      case "excited":
        return <FaRegGrinStars fontSize={iconSize} />;
      case "loved":
        return <BiHappyHeartEyes fontSize={iconSize} />; // Import the icon for loved feeling
      case "grateful":
        return <TbMoodBoy fontSize={iconSize} />;
      case "crazy":
        return <TbMoodCrazyHappy fontSize={iconSize} />;
      case "cool":
        return <BiCool fontSize={iconSize} />;
      case "chill":
        return <ImHappy fontSize={iconSize} />;
      case "motivated":
        return <TfiFaceSmile fontSize={iconSize} />;
      default:
        return null;
    }
  };

  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePosts(postId));

    if (isAccount) {
      dispatch(fetchMyPosts());
    } else {
      dispatch(fetchAllPosts());
    }
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user?.user?._id) {
        setLiked(true);
      }
    });
  }, [likes, user?.user?._id]);

  const updatePostHandler = (e) => {
    e.preventDefault();
    dispatch(
      updatePost(postId, captionValue, tagsValue, feeling, locationValue)
    );
    dispatch(fetchMyPosts());
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFullscreenImageIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(postComment(postId, commentValue));
    toast.success("Comment Added");

    if (isAccount) {
      dispatch(fetchMyPosts());
    } else {
      dispatch(fetchAllPosts());
    }
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    toast.success("Post Deleted");
    dispatch(fetchMyPosts());
    dispatch(getUserDetails());
  };

  return (
    <div className="post">
      <div className="postHeader"></div>
      {fullscreenImageIndex !== null && (
        <div className="fullscreen-overlay">
          <img
            src={postImage[fullscreenImageIndex]}
            alt={`Post ${fullscreenImageIndex}`}
            style={{
              width: "80%",
              height: "97%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 0,
              left: 535,
            }}
          >
            <CloseIcon
              onClick={() => setFullscreenImageIndex(null)}
              style={{ cursor: "pointer", fontSize: 60 }}
            />
          </div>
        </div>
      )}
      <Carousel
        interval={5000}
        selectedItem={activeIndex}
        onSelect={handleSelect}
        infiniteLoop
        showIndicators={false}
        showStatus={false}
      >
        {postImage.map((image, index) => (
          <div key={index} onClick={() => setFullscreenImageIndex(index)}>
            <img src={image} alt="" />
          </div>
        ))}
      </Carousel>
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
            "@media screen and (max-width: 600px)": {
              // Adjust padding for smaller screens
              width: "7vmax",
              height: "7vmax",
            },
            "@media screen and (min-width: 601px) and (max-width: 900px)": {
              width: "7vmax",
              height: "7vmax", // Adjust font size for smaller screens
            },
          }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography
            fontWeight={700}
            style={{ marginLeft: "-18px", textDecoration: "underline" }}
          >
            {ownerName}
          </Typography>
          <div style={{ marginTop: "-20px", marginLeft: "100px" }}>
            <Typography fontWeight={50} fontSize={12} color="rgba(0, 0, 0, 1)">
              -at {new Date(createdAt).toLocaleString()}
            </Typography>
          </div>
        </Link>

        {isAccount ? (
          <Button
            sx={{
              marginLeft: "500px",
              marginTop: "-46px",
            }}
            onClick={() => setEditing(true)}
          >
            <MoreVert />
          </Button>
        ) : userId === user && user.user && user.user._id ? (
          <Button
            sx={{
              marginLeft: "500px",
              marginTop: "-46px",
            }}
            onClick={() => setEditing(true)}
          >
            <MoreVert />
          </Button>
        ) : null}

        <Typography fontWeight={100} color="rgba(0, 0, 0, 1)">
          {caption}
        </Typography>

        {tags.length > 0 && (
          <Typography
            fontWeight={100}
            color="rgba(0, 0, 0, 1)"
            style={{ marginTop: "15px" }}
          >
            {tags.map((tag, index) => (
              <span key={index}>#{tag} </span>
            ))}
          </Typography>
        )}

        {feeling ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
              // Adjust the margin top as needed
            }}
          >
            -{getFeelingIcon(feeling)}{" "}
            <Typography
              fontWeight={100}
              color="rgba(0, 0, 0, 1)"
              style={{
                marginLeft: "4px", // Add some space between the icon and text
              }}
            >
              feeling {feeling}
            </Typography>
          </div>
        ) : null}
        {location ? (
          <Typography
            component="a" // Use an anchor element
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location
            )}`} // Google Maps URL
            target="_blank" // Open in a new tab
            rel="noopener noreferrer" // Security measure
            fontWeight={100}
            color="rgba(0, 0, 0, 0.582)"
            style={{
              marginLeft: "1px",
            }}
          >
            -at{" "}
            <span style={{ fontWeight: 600 }} className="location-hover">
              {location}.
            </span>
          </Typography>
        ) : null}
      </div>
      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}
      >
        <Typography>
          {likes.length === 0
            ? "No Likes"
            : likes.length === 1
            ? "1 Like"
            : `${likes.length} Likes`}
        </Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>

        <Button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
          <Typography>
            {comments.length === 0
              ? "(0)"
              : comments.length === 1
              ? "(1)"
              : `(${comments.length})`}
          </Typography>
        </Button>

        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>
      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>

          {likes.map((like) => (
            <UserDetails
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar ? like.avatar.url : null}
            />
          ))}
        </div>
      </Dialog>
      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>

          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              required
            />

            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>
          {comments.length > 0 ? (
            comments.map((item) => (
              <CommentCard
                userId={item.user?._id}
                name={item.user?.name}
                avatar={item.user?.avatar?.url}
                comment={item.comment}
                commentId={item._id}
                key={item._id}
                postId={postId}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography>No comments Yet</Typography>
          )}
        </div>
      </Dialog>

      <div>
        {editing && ( // Render input field when editing
          <div className="updating-form">
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption..."
            />
            <input
              type="text"
              value={tagsValue.join(", ")} // Convert array to string
              onChange={(e) => setTagsValue(e.target.value.split(", "))}
              placeholder="Tags..." // Convert string to array
            />
            <input
              type="text"
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              placeholder="Location..."
            />
            <button
              type="text"
              onClick={updatePostHandler}
              style={{ display: "flex", gridTemplate: "repeat(1, 50px)" }}
            >
              <FiEdit2 />
              Update
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ display: "flex", gridTemplate: "repeat(1, 50px)" }}
            >
              <ImCancelCircle />
              Cancel
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Post;
