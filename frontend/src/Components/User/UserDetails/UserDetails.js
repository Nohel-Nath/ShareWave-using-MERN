import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

function UserDetails({ userId, name, avatar }) {
  return (
    <Link to={`/user/${userId}`} className="homeUser">
      <img src={avatar} alt={name} />
      <Typography>{name}</Typography>
    </Link>
  );
}

export default UserDetails;
