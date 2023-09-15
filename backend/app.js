const express = require("express");
const app = express();
const dotenv = require("dotenv");
//const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// Config
//dotenv.config({ path: ".env" });
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/.env" });
}

const cors = require("cors");
const path = require("path");

const compression = require("compression");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());
const corsOptions = {
  origin: "https://share-wave.vercel.app/",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
//app.use(bodyParser.json({ limit: "50mb" }));
app.use(compression());

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const storyRouter = require("./routes/storyRoutes");
require("./controller/jobSchedule");
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/notification", notificationRouter);
app.use("/story", storyRouter);

/*app.get("/", (req, res) => {
  res.send("Hello, World!");
});*/

app.use(express.static(path.join(__dirname, "./public"), { maxAge: 31536000 }));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

module.exports = app;
