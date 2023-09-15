import React, { useEffect, useState } from "react";
import "./login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, loginUser } from "../../../Actions/UserActions";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passShow, setPassShow] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const { error, isAuthenticated, loading } = useSelector(
    (state) => state.user
  );

  const loginHandler = (e) => {
    e.preventDefault();
    const form = e.target;

    let hasError = false;
    if (email.trim() === "") {
      form.elements.email.setCustomValidity("Email is required!");
      toast.error("Email is required!", {
        position: toast.POSITION.TOP_LEFT,
      });
      hasError = true;
    } else if (password.trim() === "") {
      form.elements.password.setCustomValidity("Password is required!");
      toast.error("Password is required!", {
        position: toast.POSITION.TOP_LEFT,
      });
      hasError = true;
    } else if (password.length < 6) {
      form.elements.password.setCustomValidity(
        "Password must be at least 6 characters long!"
      );
      toast.error("Password must be at least 6 characters long!", {
        position: toast.POSITION.TOP_LEFT,
      });
      hasError = true;
    }

    form.elements.email.setCustomValidity("");
    form.elements.password.setCustomValidity("");

    form.reportValidity();

    if (!hasError) {
      dispatch(loginUser(email, password));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      toast.success("Login successful", {
        position: toast.POSITION.TOP_LEFT,
      });

      history("/"); // Redirect to account page if authenticated
    }
  }, [isAuthenticated, error, history, dispatch]);

  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler} noValidate>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Welcome
        </Typography>

        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <input
            type={!passShow ? "password" : "text"}
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

        <Link to="/forgot/password">
          <Typography>Forgot Password?</Typography>
        </Link>

        <Button
          type="submit"
          disabled={loading}
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
          Login
        </Button>

        <Link to="/register">
          <Typography>New User?</Typography>
        </Link>
        <ToastContainer />
      </form>
    </div>
  );
}

export default Login;
