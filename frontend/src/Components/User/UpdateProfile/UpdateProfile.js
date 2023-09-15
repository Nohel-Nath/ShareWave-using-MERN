import React, { useEffect, useState } from "react";
import "./updateProfile.css";
import { Avatar, Button, Typography } from "@mui/material";
import {
  clearErrors,
  getUserDetails,
  updateProfile,
} from "../../../Actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UPDATE_USERS_RESET } from "../../../Constants/UserConstants";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState(user && user.user && user.user.name);
  const [email, setEmail] = useState(user && user.user && user.user.email);
  const [website, setWebsite] = useState(
    user && user.user && user.user.website
  );
  const [avatar, setAvatar] = useState("");
  const [avatarPrev, setAvatarPrev] = useState(
    user && user.user && user.user.avatar.url
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPrev(Reader.result);

        setAvatar(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(name, email, website, avatar));
    dispatch(getUserDetails());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      //toast.success("Profile Updated Successfully");
      dispatch(getUserDetails());
      navigate("/account");
      dispatch({
        type: UPDATE_USERS_RESET,
      });
    }
  }, [dispatch, isUpdated, navigate, error, updateError]);
  return loading ? (
    <Loader />
  ) : (
    <div className="updateProfile">
      <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Update Profile
        </Typography>

        <Avatar
          src={avatarPrev}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />

        <input
          type="file"
          accept="image/*"
          name="avatar"
          onChange={handleImageChange}
        />

        <input
          type="text"
          value={name}
          placeholder="Name"
          name="name"
          className="updateProfileInputs"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="updateProfileInputs"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="website"
          placeholder="Website"
          name="website"
          className="updateProfileInputs"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <Button
          disabled={updateLoading}
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
          }}
        >
          Update
        </Button>
      </form>
    </div>
  );
}

export default UpdateProfile;
