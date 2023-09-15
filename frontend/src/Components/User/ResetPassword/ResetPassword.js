import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./resetPassword.css";

function ResetPassword() {
  const history = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [passShow, setPassShow] = useState(false);
  const { token } = useParams();

  const sendPassword = async (e) => {
    e.preventDefault();

    if (newPassword === "") {
      toast.error("Password is required!");
      return;
    }
    if (newPassword.length < 6) {
      alert.error("Password must be at least 6 characters!");
      return;
    }
    try {
      await axios.put(
        `https://sharewave.vercel.app/user/password-reset/${token}`,
        {
          password: newPassword,
        }
      );

      toast.success("Password changed");
      history("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={sendPassword}>
        <Typography
          variant="h4"
          style={{ padding: "2vmax", textDecoration: "underline" }}
        >
          Reset Password?
        </Typography>

        <input
          type={!passShow ? "password" : "text"}
          placeholder="New Password"
          required
          className="updatePasswordInputs"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="newPass" onClick={() => setPassShow(!passShow)}>
          {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
        </div>

        <Link to="/login">
          <Typography>Login</Typography>
        </Link>
        <Typography>Or</Typography>

        <Link to="/forgot/password">
          <Typography>Request Another Token!</Typography>
        </Link>

        <Button
          type="submit"
          value="Change"
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
              fontSize: "1.8vmax",
              marginTop: ".5vmax", // Adjust font size for smaller screens
            },
          }}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
