import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import {
  Block,
  Dashboard,
  People,
  PostAdd,
  WebStories,
} from "@mui/icons-material";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">
        <img
          src="https://images.inc.com/uploaded_files/image/1920x1080/getty_916036268_406753.jpg"
          alt="ECommerce"
        />
      </Link>
      <Link to="/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>

      <Link to="/admin/users">
        <p>
          <People /> All Users
        </p>
      </Link>
      <Link to="/admin/blockList">
        <p>
          <Block /> Blocking
        </p>
      </Link>
      <Link to="/admin/posts">
        <p>
          <PostAdd /> All Posts
        </p>
      </Link>
      <Link to="/admin/stories">
        <p>
          <WebStories /> All Stories
        </p>
      </Link>
    </div>
  );
}

export default Sidebar;
