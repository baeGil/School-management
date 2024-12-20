const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./controllers/components/sequelize");
const cors = require("cors");
const bodyparser = require("body-parser");
// var logger = require("morgan");
const { check_admin } = require("./controllers/components/check_admin");

// run tailwindcss
// npx tailwindcss -i ./src/styles.css -o ./public/stylesheets/styles.css --watch

// import auth
const {
  check_token,
  is_admin,
  is_student,
  is_teacher,
  block_site,
} = require("./controllers/components/auth");

// import route
const login = require("./routes/login");
const admin = require("./routes/admin.route");
const student = require("./routes/student.route");
const teacher = require("./routes/teacher.route");
const normal = require("./routes/normal.route");
const { change_password } = require("./controllers/components/forgotpw");

// import view route
// const view = require("./routes/view.route");
// const teacher = require("./routes/teacher.route");

const app = express();
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

//import models
require("./models/class_timetable.model");
require("./models/class_time.model");
require("./models/score.model");
require("./models/class_list.model");
require("./models/subjects.model");
require("./models/users.model");
require("./models/student_results.model");
require("./models/student_timetable.model");
require("./models/class_teacher.model");

// sync Db
sequelize
  .sync({ alter: false })
  .then((result) => {
    console.log(result.models);
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

// // view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// log tat ca route dc request vao console
// app.use(logger("dev"));
check_admin();

// allow json
app.use(bodyparser.json());
// xu ly json truyen vao va dat trong req.body
app.use(express.json());
// phan tich du lieu chuoi truy van trong url
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// render main view page for each role and login page
// block site de chan user quay lai trang login khi co token
app.use("/view/login", block_site, async function (req, res, next) {
  res.render("pages/login");
});

// reset password
app.get("/forgotPassword", block_site, (req, res) => {
  res.render("pages/forgotPassword");
});
app.get("/api/resetPassword/:emailToken", (req, res) => {
  const emailToken = req.params.emailToken;
  res.render("pages/resetPassword", { data: emailToken });
});
app.use("/api/resetPassword", require("./routes/resetpw.route"));

app.use("/normal", normal);
// app.use(
//   "/view/home/2",
//   check_token,
//   is_teacher,
//   async function (req, res, next) {
//     res.render("pages/teacher");
//   }
// );
// log user in
app.use("/login", login);

// log user out
app.get("/logout", function (req, res) {
  // Clearing the cookie
  res.clearCookie("jwt");
  res.json({ msg: "Cookie cleared" });
  console.log("Cookie cleared");
});

// check token, role va phan quyen
app.use(check_token);
app.use("/changePassword", function (req, res) {
  const data = req.user.id;
  res.render("pages/changePassword", { data: data });
});
app.post("/api/changePassword", change_password);

// CRUD
app.use("/0", is_admin, admin);
app.use(
  "/1/:id",
  is_student,
  async function (req, res, next) {
    const user = req.user;
    try {
      if (user.id == req.params.id) next();
      else {
        res.json({ msg: "Day khong phai la ban" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  student
);
app.use(
  "/2/:id",
  is_teacher,
  async function (req, res, next) {
    const user = req.user;
    try {
      if (user.id == req.params.id) next();
      else {
        res.json({ msg: "Day khong phai la ban" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  teacher
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json("loi roi");
  // res.render("error");
});
module.exports = app;
// http://localhost:4000/0/view/home/showUser
