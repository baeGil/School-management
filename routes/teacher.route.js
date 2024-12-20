const express = require("express");
// const {
//   check_existed,
//   handle_msgv,
//   add_info,
//   zerofill_dob,
// } = require("../controllers/teacher/crud_info");
const users = require("../models/users.model.js");
const router = express.Router();
const {
  teach_registration,
  check_trung_TKB,
  check_class,
  show_tkb,
  delete_class,
} = require("../controllers/teacher/teach_registration");
const class_list = require("../models/class_list.model.js");
const { Op } = require("sequelize");
const class_timetable = require("../models/class_timetable.model.js");
const score = require("../models/score.model.js");
const { add_score } = require("../controllers/teacher/crud_score.js");
// dang ky lop
router.post(
  "/class/registration",
  check_class,
  check_trung_TKB,
  teach_registration
);
// xem tkb gv
router.get("/show_tkb", show_tkb);
// xoa lop da dang ky
router.post("/delete", delete_class);
// nhap diem
router.post("/add_score", add_score);

router.get("/view/home", async function (req, res, next) {
  const data = await users.findByPk(req.user.id);
  res.render("pages/teacher", { data: data });
});
router.get("/view/registration", show_tkb, async function (req, res) {
  try {
    const data = req.data;
    res.render("partials/teacher/registration", {
      id: req.user.id,
      so_luong_lop: data.so_luong_lop,
      tkb: data.tkb,
    });
  } catch (err) {
    console.log(err);
  }
}); // done
router.get("/view/classlist", show_tkb, async function (req, res) {
  try {
    const data = req.data;
    res.render("partials/teacher/class_list", {
      id: req.user.id,
      so_luong_lop: data.so_luong_lop,
      tkb: data.tkb,
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/view/detailClass/:ma_lop", async function (req, res) {
  const classList = await class_list.findAll({
    where: { ma_lop: req.params.ma_lop },
  });
  const id_sv = classList.map((data) => data.id_sinh_vien);
  const Class = await class_timetable.findOne({
    where: {
      ma_lop: req.params.ma_lop,
    },
  });
  const hp = await score.findAll({
    where: {
      [Op.and]: [
        { ma_hoc_phan: Class.ma_hoc_phan },
        {
          id_sinh_vien: {
            [Op.in]: id_sv,
          },
        },
      ],
    },
    order: [["id_sinh_vien", "ASC"]],
  });
  const data = await users.findAll({
    where: {
      id: {
        [Op.in]: id_sv,
      },
    },
    order: [["id", "ASC"]],
  });
  res.render("partials/teacher/detailClass", {
    data: data,
    hp: hp,
    id: req.user.id,
    ma_lop: req.params.ma_lop,
    ma_hoc_phan: Class.ma_hoc_phan,
    hoc_ky: classList[0].hoc_ky,
  });
});
module.exports = router;
