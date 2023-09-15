import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import "./createPost.css";
import { clearErrors, createNewPost } from "../../../Actions/PostActions";
import { getUserDetails } from "../../../Actions/UserActions";
import { BiHappy, BiSad, BiAngry } from "react-icons/bi";
import { FaRegGrinStars } from "react-icons/fa";
import { BiHappyHeartEyes } from "react-icons/bi";
import { TbMoodBoy, TbMoodCrazyHappy } from "react-icons/tb";
import { BiCool } from "react-icons/bi";
import { ImHappy } from "react-icons/im";
import { TfiFaceSmile } from "react-icons/tfi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { CREATE_MY_POSTS_RESET } from "../../../Constants/PostConstants";

function CreatePost() {
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);
  const [feeling, setFeeling] = useState("");

  const [isFeelingDialogOpen, setIsFeelingDialogOpen] = useState(false);

  const { loading, error, success } = useSelector((state) => state.newPost);

  const feelings = [
    "happy",
    "sad",
    "angry",
    "excited",
    "loved",
    "grateful",
    "crazy",
    "cool",
    "chill",
    "motivated",
  ];

  const getFeelingIcon = (feeling) => {
    const iconSize = 22;
    switch (feeling.toLowerCase()) {
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
        break;
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openFeelingDialog = () => {
    setFeeling("happy");
    setIsFeelingDialogOpen(true);
  };

  const closeFeelingDialog = () => {
    setIsFeelingDialogOpen(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const tagsArray =
      tags && typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim())
        : [];

    // Define feeling and location as variables
    const feelingValue = feeling || ""; // Use an empty string if feeling is falsy
    const locationValue = location || ""; // Use an empty string if location is falsy

    await dispatch(
      createNewPost(caption, image, tagsArray, feelingValue, locationValue)
    );

    dispatch(getUserDetails());
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImage((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Post Created Successfully");
      navigate("/");
      dispatch({ type: CREATE_MY_POSTS_RESET });
    }
  }, [dispatch, error, success, navigate]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        {image &&
          imagePreview.map((image, index) => (
            <img key={index} src={image} alt="Images Preview" />
          ))}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          multiple
        />
        <input
          type="text"
          placeholder="Caption..."
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent the default behavior (form submission)
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent the default behavior (form submission)
              // Insert a newline character at the current cursor position
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              setCaption(
                caption.substring(0, start) + "\n" + caption.substring(end)
              );
              // Move the cursor to the end of the inserted line
              e.target.setSelectionRange(start + 1, start + 1);
            }
          }}
        />
        <input
          type="text"
          placeholder="Tags..."
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Feeling..."
          name="feeling"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          onClick={openFeelingDialog}
        />
        <input
          type="text"
          placeholder="Location.."
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Button
          disabled={loading}
          type="submit"
          sx={{
            paddingLeft: "1.5vmax",
            paddingRight: "1.5vmax",
            borderRadius: "15px",
            fontDisplay: "underline",
            fontSize: "1.5vmax",
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
            "@media screen and (min-width: 601px) and (max-width: 900px)": {
              fontSize: "2vmax", // Adjust font size for smaller screens
            },
          }}
        >
          Post
        </Button>

        <Dialog open={isFeelingDialogOpen} onClose={closeFeelingDialog}>
          <DialogTitle>Feeling/activity</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <Select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                onClose={closeFeelingDialog}
              >
                {feelings.map((feel) => (
                  <MenuItem key={feel} value={feel}>
                    {getFeelingIcon(feel)}{" "}
                    {feel.charAt(0).toUpperCase() + feel.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeFeelingDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreatePost;
