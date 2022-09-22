const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");
const { createReadStream } = require("fs");
const path = require("path");
// const styles = require("/styles.css");

const app = express();
const port = process.env.PORT || 8080;
const hostname = "localhost";

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "createUser.html"));
});

app.post("/login", (req, res) => {
  var defaultUsername = req.body.usernameInput;
  var defaultPassword = req.body.passwordInput;
  res.cookie("username", defaultUsername, { maxAge: 60000 });
  res.cookie("password", defaultPassword, { maxAge: 60000 });
  res.redirect("/login");
});

// app.use(
//   session({
//     secret: "arkcsfo234",
//     cookie: { maxAge: 60000 },
//   })
// );

app.post("/authUser", (req, res) => {
  if (
    req.body.username == req.cookies.username &&
    req.body.password == req.cookies.password
  ) {
    res.redirect("/main");
  } else {
    res.redirect("/login");
  }
});

app.get("/main", (req, res) => {
  if (req.cookies.username && req.cookies.password) {
    res.write(`<h1>Hi ${req.cookies.username} and welcome to the main page</h1>
      <button onclick="location.href='/editUser'">
        Change username and password
      </button>`);
    res.end();
  } else {
    res.redirect("/login");
  }
});

app.get("/editUser", (req, res) => {
  res.sendFile(path.join(__dirname, "editUser.html"));
});

app.post("/main", (req, res) => {
  res.clearCookie("username", [req.cookies.username]);
  res.clearCookie("password", [req.cookies.password]);
  res.cookie("username", req.body.newUsername, { maxAge: 60000 });
  res.cookie("password", req.body.newPassword, { maxAge: 60000 });
  res.redirect("/main");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const users = [
  {
    username: "Martine",
    password: "asd",
  },
];

// get the cookie incoming request
app.get("/getcookie", (req, res) => {
  //show the saved cookies
  console.log(req.cookies);
  res.send(req.cookies);
});

app.listen(port, hostname, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
