import React, { useEffect, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import {
  Home,
  HomeOutlined,
  AddOutlined,
  SearchOutlined,
  AccountCircle,
  AccountCircleOutlined,
  Notifications,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import { allNotificationDetails } from "../../Actions/UserActions";

function Header() {
  const [tab, setTab] = useState(window.location.pathname);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { user } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notifications);
  const isAdmin = user && user.user && user.user.role === "admin";
  const notificationCount =
    notifications &&
    notifications.notifications &&
    notifications.notifications.length;
  useEffect(() => {
    dispatch(allNotificationDetails());
  }, [dispatch]);
  // Assuming you have a 'role' field in your user state

  return (
    <div className="header">
      <Link to="/" onClick={() => setTab("/")}>
        {tab === "/" ? <Home style={{ color: "black" }} /> : <HomeOutlined />}
      </Link>

      <Link to="/newpost" onClick={() => setTab("/newpost")}>
        {tab === "/newpost" ? (
          <AddOutlined style={{ color: "black" }} />
        ) : (
          <AddOutlined />
        )}
      </Link>

      <Link to="/search" onClick={() => setTab("/search")}>
        {tab === "/search" ? (
          <SearchOffOutlinedIcon style={{ color: "black" }} />
        ) : (
          <SearchOutlined />
        )}
      </Link>
      <Link to="/notification" onClick={() => setTab("/notification")}>
        <div className="noti-icon">
          {tab === "/notification" ? (
            <Notifications
              style={{ color: "black", textDecoration: "none" }}
              fontSize="60px"
            />
          ) : (
            <Notifications
              style={{ color: "black", textDecoration: "none" }}
              fontSize="60px"
            />
          )}

          <div>
            {notificationCount > 0 && (
              <p className="notification-count" style={{ color: "black" }}>
                ({notificationCount})
              </p>
            )}
          </div>
        </div>
      </Link>

      {isAuthenticated ? (
        <>
          <Link to="/account">
            <AccountCircle style={{ color: "black" }} />
          </Link>

          {isAdmin && (
            <Link to="/dashboard" onClick={() => setTab("/dashboard")}>
              {tab === "/dashboard" ? (
                <DashboardIcon style={{ color: "black" }} />
              ) : (
                <DashboardOutlinedIcon />
              )}
            </Link>
          )}
        </>
      ) : (
        <Link to="/login">
          <AccountCircleOutlined />
        </Link>
      )}
    </div>
  );
}

export default Header;
