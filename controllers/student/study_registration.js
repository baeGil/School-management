const class_timetable = require("../../models/class_timetable.model");
const student_timetable = require("../../models/student_timetable.model");
const subjects = require("../../models/subjects.model");
const student_results = require("../../models/student_results.model");
const _ = require("lodash");
const class_list = require("../../models/class_list.model");
const { Op } = require("sequelize");
const score = require("../../models/score.model");

// tim lop
async function check_class(req, res, next) {
  try {
    const data = req.body;
    // tim lop hoc ung voi ma lop
    const Class = await class_timetable.findOne({
      where: {
        [Op.and]: [{ ma_lop: data.ma_lop }, { trang_thai_gv: 1 }],
      },
    });
    if (Class) {
      req.Class = Class;
      next();
    } else {
      res.json({ msg: "Khong co lop" });
    }
  } catch (err) {
    console.log(err);
  }
} // teacher
// check trung mon hoac trung lop
async function check_duplicate(req, res, next) {
  try {
    const sub = await score.findOne({
      where: {
        ma_hoc_phan: req.Class.ma_hoc_phan,
        id_sinh_vien: req.user.id,
      },
    });
    const lop = await student_timetable.findOne({
      where: {
        id_sinh_vien: req.user.id,
        ma_lop: req.Class.ma_lop,
      },
    });
    if (!sub && !lop) {
      next();
    } else {
      res.json({ msg: "Ban da co mon / lop nay roi" });
    }
  } catch (err) {
    console.log(err);
  }
}
function check_active(req, res, next) {
  if (req.Class.trang_thai == 1) {
    next();
  } else {
    res.json({ msg: "Lop khong mo dang ky" });
  }
} // teacher

function check_lop_day(req, res, next) {
  if (req.Class.so_luong_max > req.Class.so_luong_dang_ky) {
    next();
  } else {
    res.json({ msg: "Lop day" });
  }
}

async function check_so_tcdk(req, res, next) {
  try {
    // tim danh sach mon hoc trong tkb cua sinh vien
    const tkb_sv = await student_timetable.findAll({
      where: {
        id_sinh_vien: req.user.id,
      },
    });
    // tinh tong tin chi cac mon hoc da dang ky
    const tong_tc = _.sum(tkb_sv.map((data) => data.so_tc_dang_ky));
    // tim xem sinh vien do duoc dang ky toi da bao nhieu tin chi
    const kq_sv = await student_results.findOne({
      where: {
        id_sinh_vien: req.user.id,
      },
    });
    // tim so tin chi dang ky cua mon hoc
    const subject = await subjects.findOne({
      where: { ma_hoc_phan: req.Class.ma_hoc_phan },
    });
    if (tong_tc + subject.so_tc_dang_ky <= kq_sv.so_tcdk_toi_da) {
      req.tkb_sv = tkb_sv;
      req.kq_sv = kq_sv;
      req.subject = subject;
      next();
    } else {
      res.json({ msg: "So tin chi dang ky dat gioi han" });
    }
  } catch (err) {
    console.log(err);
  }
}
async function check_trung_TKB(req, res, next) {
  // tim danh sach lop cua hoc sinh
  const ma_lop_arr = req.tkb_sv.map((data) => data.ma_lop);
  const tkb = await class_timetable.findAll({
    where: {
      ma_lop: {
        [Op.in]: ma_lop_arr,
      },
    },
  });
  const sub_arr = [req.Class.ca_bat_dau, req.Class.ca_ket_thuc];
  // tinh array tkb
  try {
    // neu tkb hoc sinh k co mon nao thi khong bi trung
    if (req.tkb_sv.length == 0) {
      next();
    } else {
      // neu co mon thi check xem co trung gio, trung ngay khong
      const tkb_arr = tkb
        .filter((data) => data.ngay_hoc == req.Class.ngay_hoc)
        .map((data) => [data.ca_bat_dau, data.ca_ket_thuc]);

      // kiem tra tkb co bi trung khong
      const valid = tkb_arr.every((data) => {
        (data[0] < sub_arr[0] && data[1] < sub_arr[0]) ||
          (data[0] > sub_arr[1] && data[1] > sub_arr[1]);
      });
      if (valid) {
        next();
      } else {
        res.json({ msg: "Trung thoi khoa bieu" });
      }
    }
  } catch (err) {
    console.log(err);
  }
} // teacher
async function study_registration(req, res) {
  const data = req.body;
  try {
    // them lop hoc vao tkb hoc sinh
    await student_timetable.create({
      hoc_ky: data.hoc_ky,
      so_tc_dang_ky: req.subject.so_tc_dang_ky,
      id_sinh_vien: req.user.id,
      ma_lop: req.Class.ma_lop,
    });
    // them hoc sinh vao danh sach lop
    await class_list.create({
      hoc_ky: data.hoc_ky,
      ma_hoc_phan: req.subject.ma_hoc_phan,
      id_sinh_vien: req.user.id,
      ma_lop: req.Class.ma_lop,
    });
    // them lop vao score
    await score.create({
      hoc_ky: data.hoc_ky,
      ma_hoc_phan: req.subject.ma_hoc_phan,
      id_sinh_vien: req.user.id,
      diem_qua_trinh: 0,
      diem_thi: 0,
    });
    // +1 vao so luong hs dang ky trong danh sach lop
    await class_timetable.increment("so_luong_dang_ky", {
      by: 1,
      where: {
        ma_lop: req.Class.ma_lop,
      },
    });
    return res.redirect(`/1/${req.user.id}/view/registration`);
  } catch (err) {
    console.log(err);
  }
} // teacher
async function show_tkb(req, res, next) {
  try {
    // tim danh sach lop trong tkb sinh vien
    const tkb_sv = await student_timetable.findAll({
      where: {
        id_sinh_vien: req.user.id,
      },
    });
    const ma_lop_arr = tkb_sv.map((data) => data.ma_lop);
    const sum_tc = _.sum(tkb_sv.map((data) => data.so_tc_dang_ky));

    // tim thong tin lop trong tkb sinh vien
    const tkb = await class_timetable.findAll({
      where: {
        ma_lop: {
          [Op.in]: ma_lop_arr,
        },
      },
    });
    // tim ma hoc phan
    const ma_hp_arr = tkb.map((data) => data.ma_hoc_phan);
    const ma_hp = await subjects.findAll({
      where: {
        ma_hoc_phan: {
          [Op.in]: ma_hp_arr,
        },
      },
    });
    // tinh hoc phi
    const hoc_phi = _.sum(
      ma_hp.map((data) => data.so_tc_hoc_phi * data.hoc_phi_mot_tc)
    );
    const data = {
      so_luong_mon_hoc: tkb_sv.length,
      so_tc: sum_tc,
      hoc_phi: hoc_phi,
      tkb: tkb,
    };
    req.data = data;
    // res.json({ data });
    next();
  } catch (err) {
    console.log(err);
  }
} // teacher

async function delete_class(req, res) {
  const data = req.body;
  try {
    // xoa lop hoc khoi tkb hoc sinh
    await student_timetable.destroy({
      where: {
        [Op.and]: { id_sinh_vien: data.id_sinh_vien, ma_lop: data.ma_lop },
      },
    });
    // xoa hoc sinh khoi danh sach lop
    await class_list.destroy({
      where: {
        [Op.and]: { id_sinh_vien: data.id_sinh_vien, ma_lop: data.ma_lop },
      },
    });

    // -1 vao so luong hs dang ky trong danh sach lop
    await class_timetable.decrement("so_luong_dang_ky", {
      by: 1,
      where: {
        ma_lop: data.ma_lop,
      },
    });
    return res.redirect(`/1/${req.user.id}/view/registration`);
  } catch (err) {
    console.log(err);
  }
} // teacher

module.exports = {
  study_registration,
  check_trung_TKB,
  check_so_tcdk,
  check_lop_day,
  check_active,
  check_class,
  show_tkb,
  delete_class,
  check_duplicate,
};
