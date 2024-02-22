const express = require("express");
require("dotenv").config();
const { db } = require("./db/db.connect");
const userRoutes = require("./Routes/userRoutes");
const movieRoutes = require("./Routes/movieRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
db();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://master--rainbow-buttercream-b0790d.netlify.app",
    "https://rainbow-buttercream-b0790d.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// Routes Middleware
app.use(userRoutes);
app.use(movieRoutes);
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});

app.get("/posts", (req, res) => {
  let posts = [
    { id: "1", title: "Post One" },
    { id: "2", title: "Post Two" },
  ];
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
