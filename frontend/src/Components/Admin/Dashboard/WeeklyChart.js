import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

function WeeklyChart() {
  const { posts } = useSelector((state) => state.adminPost);
  const postCountsByDay = [0, 0, 0, 0, 0, 0, 0]; // Initialize an array for each day of the week (Sunday to Saturday)

  posts &&
    posts.posts &&
    posts.posts.forEach((post) => {
      const createdAt = new Date(post.createdAt);
      const dayOfWeek = createdAt.getDay(); // 0 (Sunday) to 6 (Saturday)
      postCountsByDay[dayOfWeek]++;
    });

  const data = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Posts Created",
        backgroundColor: "#1bf5ea",
        borderColor: "black",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "black",
        data: postCountsByDay,
      },
    ],
  };

  ChartJs.register(BarElement, Tooltip, LinearScale, CategoryScale, Legend);

  return (
    <div>
      <div style={{ width: "60%", marginLeft: "260px", marginTop: "80px" }}>
        <Bar data={data} />
      </div>
    </div>
  );
}

export default WeeklyChart;
