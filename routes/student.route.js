const express = require("express");
const router = express.Router();
const users = require("../models/users.model.js");
const classes = require("../models/class_timetable.model.js");
const {
  study_registration,
  check_trung_TKB,
  check_so_tcdk,
  check_lop_day,
  check_active,
  check_class,
  show_tkb,
  delete_class,
  check_duplicate,
} = require("../controllers/student/study_registration.js");
const { show_score } = require("../controllers/student/score.js");
// dang ky lop
router.post(
  "/class/registration",
  check_class,
  check_duplicate,
  check_so_tcdk,
  check_active,
  check_lop_day,
  check_trung_TKB,
  study_registration
); //done
router.get("/show_tkb", show_tkb); //done
// xoa lop da dang ky
router.post("/delete", delete_class); // done
// show bang diem
router.post("/show_score", show_score);

router.get("/view/home", async function (req, res, next) {
  const data = await users.findByPk(req.user.id);
  res.render("pages/student", { data: data });
});
router.get("/view/registration", show_tkb, async function (req, res) {
  try {
    const data = req.data;
    res.render("partials/student/registration", {
      id: req.user.id,
      so_luong_mon_hoc: data.so_luong_mon_hoc,
      so_tc: data.so_tc,
      hoc_phi: data.hoc_phi,
      tkb: data.tkb,
    });
  } catch (err) {
    console.log(err);
  }
}); // done
router.get("/view/showScore", show_score, async function (req, res) {
  const data = req.result;
  const ten_hp = req.ten_hoc_phan;
  res.render("partials/student/show_score", {
    data: data,
    id: req.user.id,
    ten_hp: ten_hp,
  });
}); //done
module.exports = router;
