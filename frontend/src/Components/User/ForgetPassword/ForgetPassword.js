import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./forgetPassword.css";

function ForgetPassword() {
  const submitButtonRef = useRef();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");

    return () => {
      setMessage("");
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitButtonRef.current.click();
    }
  };

  const sendLink = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://share-wave.vercel.app/user/password-forgot",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = res.data;
      if (res.status === 200 && data.success) {
        setEmail("");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="forgotPassword">
      <form className="forgotPasswordForm">
        <Typography
          variant="h4"
          style={{ padding: "2vmax", textDecoration: "underline" }}
        >
          Forget Password?
        </Typography>

        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          className="forgotPasswordInputs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Button
          type="submit"
          value="Send"
          ref={submitButtonRef}
          onClick={sendLink}
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
          Send Token
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ForgetPassword;
