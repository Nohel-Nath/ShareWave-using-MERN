import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import "./updatePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { clearErrors, updatePassword } from "../../../Actions/UserActions";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { UPDATE_PASSWORD_RESET } from "../../../Constants/UserConstants";
import "react-toastify/dist/ReactToastify.css";
function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const [passShow, setPassShow] = useState(false);
  const [passShow1, setPassShow1] = useState(false);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updatePassword(oldPassword, newPassword));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Password Updated Successfully");

      navigate("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, navigate, isUpdated]);

  return (
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography
          variant="h4"
          style={{ padding: "2vmax", textDecoration: "underline" }}
        >
          Update Password?
        </Typography>

        <input
          type={!passShow ? "password" : "text"}
          placeholder="Old Password"
          name="oldPassword"
          value={oldPassword}
          required
          className="updatePasswordInputs"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <div
          className="oldPassword-toggle-icon"
          onClick={() => setPassShow(!passShow)}
        >
          {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
        </div>

        <input
          type={!passShow1 ? "password" : "text"}
          placeholder="New Password"
          name="newPassword"
          value={newPassword}
          required
          className="updatePasswordInputs"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div
          className="newPassword-toggle-icon"
          onClick={() => setPassShow1(!passShow1)}
        >
          {passShow1 ? <BsEyeSlashFill /> : <BsEyeFill />}
        </div>

        <Button
          disabled={loading}
          type="submit"
          sx={{
            paddingLeft: "1vmax",
            paddingRight: "1vmax",
            borderRadius: "15px",
            fontDisplay: "underline",
            fontSize: "1vmax",
            backgroundColor: "rgb(38, 63, 173)",
            color: "white",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              borderRadius: "30px",
            },
            "@media screen and (max-width: 600px)": {
              fontSize: "1.8vmax", // Adjust font size for smaller screens
              padding: "1.5vmax", // Adjust padding for smaller screens
              width: "150px",
            },
            "@media screen and (min-width: 601px) and (max-width: 900px)": {
              fontSize: "2vmax",
              marginTop: ".5vmax", // Adjust font size for smaller screens
            },
          }}
        >
          Change Password
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UpdatePassword;
