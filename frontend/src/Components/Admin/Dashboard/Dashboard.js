import React, { useEffect } from "react";
import "./dashboard.css";

import { Link } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { adminUserDetails } from "../../../Actions/UserActions";
import { fetchAdminPosts, fetchStoryPosts } from "../../../Actions/PostActions";
import WeeklyChart from "./WeeklyChart";
import MonthlyChart from "./MonthlyChart";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJs,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import StoryChart from "./StoryChart";

function Dashboard() {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.adminUser);
  const { posts } = useSelector((state) => state.adminPost);
  const { stories } = useSelector((state) => state.allStory);

  useEffect(() => {
    dispatch(adminUserDetails());
    dispatch(fetchAdminPosts());
    dispatch(fetchStoryPosts());
  }, [dispatch]);

  const userRoleCount =
    users &&
    users.users &&
    users.users.filter((user) => user.role === "user").length;

  // Calculate the number of users with the "admin" role
  const adminRoleCount =
    users &&
    users.users &&
    users.users.filter((user) => user.role === "admin").length;

  const doughnutState = {
    labels: ["User", "Admin"],
    datasets: [
      {
        backgroundColor: ["#c75af2", "#b40045"],
        hoverBackgroundColor: ["#c75af2", "#b40045"],
        data: [userRoleCount, adminRoleCount],
      },
    ],
  };

  ChartJs.register(ArcElement, Tooltip, LinearScale, CategoryScale, Legend);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div className="dashboardSummaryBox2">
            <Link to="/admin/orders">
              <p>Posts</p>
              <p>{posts && posts.posts && posts.posts.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.users && users.users.length}</p>
            </Link>
            <Link to="/admin/stories">
              <p>Stories</p>
              <p>{stories && stories.length}</p>
            </Link>
          </div>
        </div>
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
        <WeeklyChart className="chart" />
        <MonthlyChart className="chart" />
        <StoryChart className="chart" />
      </div>
    </div>
  );
}

export default Dashboard;
