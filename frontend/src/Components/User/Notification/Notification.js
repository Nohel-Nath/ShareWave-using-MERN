import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  allNotificationDetails,
  clearErrors,
} from "../../../Actions/UserActions";
import "./notification.css";

import Loader from "../../Loader/Loader";
import { Delete } from "@mui/icons-material";
import axios from "axios";

function Notification() {
  const dispatch = useDispatch();

  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(allNotificationDetails());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const extractImageUrlFromContent = (content) => {
    // Use a regular expression to find a URL pattern in the content
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = content.match(urlRegex);

    // Check if a URL pattern was found
    if (match && match[0]) {
      return match[0];
    }

    return null;
  };

  const extractTextFromContent = (content) => {
    // Split the content by the image URL
    const parts = content.split(extractImageUrlFromContent(content));

    // Get the second part (the text) and remove leading/trailing spaces
    const text = parts[1].trim();

    return text;
  };

  const handleDelete = async (notificationId) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.delete(
        `https://share-wave.vercel.app/notification/delete/${notificationId}`,
        config
      );

      if (response.data.success === true) {
        toast.success("Notification deleted");
        dispatch(allNotificationDetails());
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return loading === true ? (
    <Loader />
  ) : (
    <div>
      {notifications &&
      notifications.notifications &&
      notifications.notifications.length > 0 ? (
        notifications.notifications.map((notification) => (
          <div key={notification._id}>
            {notification.content && (
              <div className="notification">
                {notification.content.includes("liked your post") && (
                  <>
                    <Button
                      onClick={() => handleDelete(notification._id.toString())}
                    >
                      <Delete />
                    </Button>
                    <img
                      src={extractImageUrlFromContent(notification.content)}
                      alt={`Avatar of ${notification.user.name}`}
                      style={{
                        width: "5vmax", // Set the width as desired
                        height: "5vmax", // Maintain the aspect ratio
                        borderRadius: "50%", // Make it round (if needed)
                      }}
                    />
                    <p>{extractTextFromContent(notification.content)}</p>
                  </>
                )}

                {notification.content.includes("commented on your post") && (
                  <>
                    <Button
                      onClick={() => handleDelete(notification._id.toString())}
                    >
                      <Delete />
                    </Button>
                    <img
                      src={extractImageUrlFromContent(notification.content)}
                      alt={`Avatar of ${notification.user.name}`}
                      style={{
                        width: "4vmax", // Set the width as desired
                        height: "4vmax", // Maintain the aspect ratio
                        borderRadius: "50%", // Make it round (if needed)
                      }}
                    />
                    <p>{extractTextFromContent(notification.content)}</p>
                  </>
                )}

                {notification.content.includes("started following you") && (
                  <>
                    <Button
                      onClick={() => handleDelete(notification._id.toString())}
                    >
                      <Delete />
                    </Button>
                    <img
                      src={extractImageUrlFromContent(notification.content)}
                      alt={`Avatar of ${notification.user.name}`}
                      style={{
                        width: "4vmax", // Set the width as desired
                        height: "4vmax", // Maintain the aspect ratio
                        borderRadius: "50%", // Make it round (if needed)
                      }}
                    />
                    <p>{extractTextFromContent(notification.content)}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <Typography
          variant="h6"
          style={{ marginTop: "50px", marginLeft: "600px" }}
        >
          No Notifications Yet
        </Typography>
      )}
      <ToastContainer />
    </div>
  );
}

export default Notification;
