require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = 3000 || process.env.PORT;
const fs = require("fs");
const presRoutes = require("./routes/routes")

//middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setting view engine-ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//setting routes middleware
app.use("/",presRoutes)

//listening to server
app.listen(PORT,() => {
  console.log("listening to port 3000");
});
