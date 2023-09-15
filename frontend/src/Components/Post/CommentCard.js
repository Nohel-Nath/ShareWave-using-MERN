import { Button, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CommentCard.css";
import { Delete, Upgrade, MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit2 } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { fetchAllPosts, fetchMyPosts } from "../../Actions/PostActions";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // Local state to track the visibility of the MoreVert menu
  const [moreVertOpen, setMoreVertOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentUpdated, setCommentUpdated] = useState(comment);
  // Open the MoreVert menu
  const handleMoreVertClick = (event) => {
    setMoreVertOpen(event.currentTarget);
  };

  // Close the MoreVert menu
  const handleMoreVertClose = () => {
    setMoreVertOpen(null);
  };
  const handleUpdateComment = async () => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.put(
        `https://sharewave.vercel.app/post/${postId}/comments/${commentId}`,
        { comment: commentUpdated },
        config
      );

      if (response.data.success) {
        setEditing(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.delete(
        `https://sharewave.vercel.app/post/${postId}/delete/${commentId}`,
        config
      );

      if (response.data.success) {
        toast.success("Comment deleted successfully");
        window.location.reload();
      }

      if (isAccount) {
        dispatch(fetchMyPosts());
      } else {
        dispatch(fetchAllPosts());
      }
    } catch (error) {
      toast.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="commentUser">
      <Link to={`/user/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography>{name}:</Typography>
      </Link>
      {editing ? ( // Render input field when editing
        <div className="editing-form">
          <input
            className="edit-input"
            type="text"
            value={commentUpdated}
            onChange={(e) => setCommentUpdated(e.target.value)}
          />

          <div className="button">
            <button onClick={handleUpdateComment} className="update-button">
              <FiEdit2 />
            </button>
            <button onClick={() => setEditing(false)} className="cancel-button">
              <ImCancelCircle />
            </button>
          </div>
        </div>
      ) : (
        // Display the comment text when not editing
        <Typography style={{ marginLeft: "10px" }}>{comment}</Typography>
      )}

      <div className="more">
        <Button onClick={handleMoreVertClick}>
          <MoreVert />
        </Button>
        <Menu
          anchorEl={moreVertOpen}
          open={Boolean(moreVertOpen)}
          onClose={handleMoreVertClose}
        >
          <MenuItem onClick={handleMoreVertClose}>
            {isAccount ? (
              <button onClick={handleDeleteComment}>
                <Delete />
              </button>
            ) : userId === user?.user?._id ? (
              <button onClick={handleDeleteComment}>
                <Delete />
              </button>
            ) : null}
          </MenuItem>
          <MenuItem onClick={handleMoreVertClose}>
            {isAccount ? (
              <button onClick={() => setEditing(true)}>
                <Upgrade />
              </button>
            ) : userId === user?.user?._id ? (
              <button onClick={() => setEditing(true)}>
                <Upgrade />
              </button>
            ) : null}
          </MenuItem>
        </Menu>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommentCard;
