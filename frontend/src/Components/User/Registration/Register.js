import React, { useEffect, useState } from "react";
import "./register.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, registerAUser } from "../../../Actions/UserActions";
import { Avatar, Button, Typography } from "@mui/material";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [passShow, setPassShow] = useState(false);

  const dispatch = useDispatch();
  const history = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.target;
    let hasError = false;
    if (name.trim() === "") {
      form.elements.name.setCustomValidity("Name is required!");
      toast.error("Name is required!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      hasError = true;
    } else if (email.trim() === "") {
      form.elements.email.setCustomValidity("Email is required!");
      toast.error("Email is required!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      hasError = true;
    } else if (password.trim() === "") {
      form.elements.password.setCustomValidity("Password is required!");
      toast.error("Password is required!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      hasError = true;
    } else if (password.length < 6) {
      form.elements.password.setCustomValidity(
        "Password must be at least 6 characters long!"
      );
      toast.error("Password must be at least 6 characters long!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      hasError = true;
    }
    form.elements.name.setCustomValidity("");
    form.elements.email.setCustomValidity("");
    form.elements.password.setCustomValidity("");
    form.reportValidity();

    if (!hasError) {
      dispatch(registerAUser(name, email, password, website, avatar));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      toast.success("Login successful", {
        position: toast.POSITION.BOTTOM_LEFT,
      });

      history("/"); // Redirect to account page if authenticated
    }
  }, [dispatch, error, history, isAuthenticated]);
  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler} noValidate>
        <Typography
          variant="h"
          style={{ padding: ".5vmax", fontSize: "2.5vmax" }}
        >
          Register a new account
        </Typography>

        <Avatar
          src={avatar}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />

        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleImageChange}
        />

        <input
          type="text"
          value={name}
          placeholder="Name"
          name="name"
          className="registerInputs"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="registerInputs"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="website"
          placeholder="website"
          name="website"
          className="registerInputs"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <div>
          <input
            type={!passShow ? "password" : "text"}
            className="registerInputs1"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="password-toggle-icon"
            onClick={() => setPassShow(!passShow)}
          >
            {passShow ? <BsEyeSlashFill /> : <BsEyeFill />}
          </div>
        </div>

        <Link to="/login">
          <Typography>Already Signed Up? Login Now</Typography>
        </Link>

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
          Sign Up
        </Button>
        <ToastContainer />
      </form>
    </div>
  );
}

export default Register;
