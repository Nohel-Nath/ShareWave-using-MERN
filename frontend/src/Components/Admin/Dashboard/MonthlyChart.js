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

function MonthlyChart() {
  const { posts } = useSelector((state) => state.adminPost);
  const postCountsByMonth = Array.from({ length: 12 }, () => 0); // Initialize an array for each month (0 to 11)

  posts &&
    posts.posts &&
    posts.posts.forEach((post) => {
      const createdAt = new Date(post.createdAt);
      const month = createdAt.getMonth(); // 0 (January) to 11 (December)
      postCountsByMonth[month]++;
    });

  // Define data for the chart
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Posts Created",
        backgroundColor: "#f51b22",
        borderColor: "black",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "black",
        data: postCountsByMonth,
      },
    ],
  };

  ChartJs.register(BarElement, Tooltip, LinearScale, CategoryScale, Legend);
  return (
    <div>
      <div style={{ width: "60%", marginLeft: "260px", marginTop: "150px" }}>
        <Bar data={data} />
      </div>
    </div>
  );
}

export default MonthlyChart;
