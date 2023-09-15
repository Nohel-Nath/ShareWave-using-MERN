import React, { useEffect, useState } from "react";
import { Avatar, Typography, Dialog, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Story.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { AddOutlined } from "@mui/icons-material";
import { getUserDetails } from "../../../../Actions/UserActions";
import {
  clearErrors,
  createNewStory,
  fetchStoryPosts,
} from "../../../../Actions/PostActions";
import { CREATE_MY_STORY_RESET } from "../../../../Constants/PostConstants";
import "./createStory.css";

function FetchStory({ userId, ownerId, stories, isAccount = false }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { user } = useSelector((state) => state.user);
  const [storyToggle, setStoryToggle] = useState(false);
  const dispatch = useDispatch();

  const handleNextStory = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex < stories.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousStory = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : stories.length - 1
    );
  };

  useEffect(() => {
    // Use a timer to automatically change the story every 5 seconds
    const timer = setInterval(() => {
      handleNextStory();
    }, 10000);

    // Clear the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [currentStoryIndex, stories]);

  const currentStory = stories[currentStoryIndex];

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newStory);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewStory(content, image));
    dispatch(getUserDetails());
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Story Created Successfully");
      navigate("/");
      dispatch(fetchStoryPosts());
      dispatch({ type: CREATE_MY_STORY_RESET });
    }
  }, [dispatch, error, success, navigate]);

  return (
    <div className="story-row">
      <div>
        <div className="create-story">
          <div
            className="create-story-content"
            onClick={() => setStoryToggle(!storyToggle)}
          >
            <img
              src={user?.user?.avatar?.url}
              alt="User Avatar"
              className="userImage"
            />
            <AddOutlined
              style={{
                color: "white",
                backgroundColor: "blue",
                borderRadius: "100%",
              }}
              className="icon"
            />
            <p>Create Story</p>
          </div>
        </div>
      </div>
      <div key={currentStory._id} className="story-container">
        <img
          src={currentStory.image ? currentStory.image.url : ""}
          alt="Story"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
        />
        <Typography fontWeight={100} color="rgba(0, 0, 0, 1)">
          {currentStory.content}
        </Typography>

        <Avatar
          src={currentStory.user.avatar?.url || ""}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
            marginTop: "5px",
            marginLeft: "8px",
            borderRadius: "50%",
            "@media screen and (max-width: 600px)": {
              width: "7vmax",
              height: "7vmax",
            },
            "@media screen and (min-width: 601px) and (max-width: 900px)": {
              width: "7vmax",
              height: "7vmax",
            },
          }}
        />

        <div>
          <Typography className="userName">
            {currentStory.user?.name}
          </Typography>
        </div>

        <div className="button-arrow">
          {stories.length > 1 && (
            <div className="story-navigation">
              <button
                onClick={handlePreviousStory}
                className="previous-story-button"
              >
                <ArrowBackIosNewIcon fontSize="large" />
              </button>
              <button onClick={handleNextStory} className="next-story-button">
                <ArrowForwardIosIcon fontSize="large" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={storyToggle} onClose={() => setStoryToggle(!storyToggle)}>
        <div className="DialogBox1">
          <div className="newStory">
            <form className="newStoryForm" onSubmit={submitHandler}>
              {image && <img src={image} alt="story" />}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />

              <input
                type="text"
                placeholder="Text..."
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent the default behavior (form submission)
                  }
                }}
              />

              <Button
                disabled={loading}
                type="submit"
                sx={{
                  paddingLeft: "2vmax",
                  paddingRight: "2vmax",
                  borderRadius: "15px",
                  fontDisplay: "underline",
                  fontSize: "1.1vmax",
                  width: "200px",
                  marginTop: "30px",
                  backgroundColor: "rgb(38, 63, 173)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "30px",
                  },
                  "@media screen and (max-width: 600px)": {
                    fontSize: "2.5vmax", // Adjust font size for smaller screens
                    padding: "1.5vmax", // Adjust padding for smaller screens
                    width: "150px",
                  },
                  "@media screen and (min-width: 601px) and (max-width: 900px)":
                    {
                      fontSize: "2vmax", // Adjust font size for smaller screens
                    },
                }}
              >
                Create Story
              </Button>
            </form>
          </div>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
}

export default FetchStory;
