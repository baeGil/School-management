const express = require("express");
const users = require("../models/users.model");
const subjects = require("../models/subjects.model");
const timetable = require("../models/class_timetable.model");
const router = express.Router();
const {
  handle_ms,
  check_existed,
  zerofill_dob,
  signup_user,
} = require("../controllers/admin/signup_user");
const {
  delete_class,
  check_ca_hoc,
  check_ma_hoc_phan,
  check_tuan_hoc,
  add_class,
  update_class,
  find_class,
} = require("../controllers/admin/crud_class");
const {
  add_subject,
  check_trong_so,
  update_subject,
  delete_subject,
  find_subject,
} = require("../controllers/admin/crud_subject");
const {
  find_user,
  update_user,
  delete_user,
} = require("../controllers/admin/crud_user");
const { add_time } = require("../controllers/admin/crud_class_time");
const { Op, DataTypes } = require("sequelize");

// class crud
router.post(
  "/class/create",
  check_tuan_hoc,
  check_ca_hoc,
  check_ma_hoc_phan,
  add_class
); //done
router.post("/class/update/:id", find_class, update_class); //done
router.post("/class/delete", delete_class); //done

// subject crud
router.post("/subject/create", check_trong_so, add_subject); //done
router.post("/subject/update/:id", find_subject, update_subject); //done
router.post("/subject/delete", delete_subject); //done

// user crud
// tao tk cho user
router.post("/signup", check_existed, handle_ms, zerofill_dob, signup_user); //done
router.post("/user/update/:id", find_user, update_user); //done
router.post("/user/delete", delete_user); //done

// crud time
router.post("/classtime/create", add_time);

// view/admin route
// user/admin route
router.get("/view/home/detailUser/:id", async function (req, res) {
  const data = await users.findByPk(req.params.id);
  res.render("partials/admin/detailUser", { data: data });
});
router.get("/view/home/updateUser/:id", async function (req, res, next) {
  const data = await users.findByPk(req.params.id);
  res.render("partials/admin/updateUser", { data: data });
});
router.get("/view/home/addUser", async function (req, res, next) {
  res.render("partials/admin/addUser");
});
router.get("/view/home/showUser", async function (req, res, next) {
  const data = await users.findAll({
    where: {
      role: {
        [Op.or]: [1, 2],
      },
    },
  });
  const user = req.user;
  res.render("partials/admin/showUser", { data: data, user: user });
});

// subject/admin route
router.get("/view/home/showSubject", async function (req, res, next) {
  const data = await subjects.findAll();
  res.render("partials/admin/showSubject", { data: data });
});
router.get("/view/home/detailSubject/:id", async function (req, res) {
  const data = await subjects.findByPk(req.params.id);
  res.render("partials/admin/detailSubject", { data: data });
});
router.get("/view/home/addSubject", async function (req, res, next) {
  res.render("partials/admin/addSubject");
});
router.get("/view/home/updateSubject/:id", async function (req, res, next) {
  const data = await subjects.findByPk(req.params.id);
  res.render("partials/admin/updateSubject", { data: data });
});

// class/admin route
router.get("/view/home/showClass", async function (req, res, next) {
  const data = await timetable.findAll();
  res.render("partials/admin/showClass", { data: data });
  console.log(data);
});
router.get("/view/home/detailClass/:id", async function (req, res) {
  const data = await timetable.findByPk(req.params.id);
  res.render("partials/admin/detailClass", { data: data });
});
router.get("/view/home/addClass", async function (req, res, next) {
  res.render("partials/admin/addClass");
});
router.get("/view/home/updateClass/:id", async function (req, res, next) {
  const data = await timetable.findByPk(req.params.id);
  res.render("partials/admin/updateClass", { data: data });
});

router.get("/:id/view/home", async function (req, res, next) {
  const data = await users.findByPk(req.user.id);
  res.render("pages/admin", { data: data });
});

module.exports = router;
