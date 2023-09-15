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

function StoryChart() {
  const { stories } = useSelector((state) => state.allStory);
  const postCountsByDay = [0, 0, 0, 0, 0, 0, 0]; // Initialize an array for each day of the week (Sunday to Saturday)

  stories &&
    stories.forEach((post) => {
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
        label: "Stories Created",
        backgroundColor: "#ccd0d5",
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

export default StoryChart;
