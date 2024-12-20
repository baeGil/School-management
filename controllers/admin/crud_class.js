const class_list = require("../../models/class_list.model");
const class_teacher = require("../../models/class_teacher.model");
const class_timetable = require("../../models/class_timetable.model");
const student_timetable = require("../../models/student_timetable.model");
const subjects = require("../../models/subjects.model");

async function add_class(req, res) {
  try {
    const data = req.body;
    const Class = await class_timetable.findOne({
      where: { ma_lop: data.ma_lop },
    });
    if (!Class) {
      await class_timetable.create({
        ma_lop: data.ma_lop,
        ma_hoc_phan: data.ma_hoc_phan,
        ghi_chu: data.ghi_chu,
        ngay_hoc: data.ngay_hoc,
        tuan_bat_dau: data.tuan_bat_dau,
        tuan_ket_thuc: data.tuan_ket_thuc,
        ca_bat_dau: data.ca_bat_dau,
        ca_ket_thuc: data.ca_ket_thuc,
        phong_hoc: data.phong_hoc,
        trang_thai: data.trang_thai,
        so_luong_dang_ky: 0,
        so_luong_max: data.so_luong_max,
      });
      // res.json({ msg: "Tạo lớp thành công" });
      return res.redirect("/0/view/home/showClass");
    }
  } catch (err) {
    console.log(err);
  }
}
function check_tuan_hoc(req, res, next) {
  const data = req.body;
  if (parseInt(data.tuan_bat_dau) < parseInt(data.tuan_ket_thuc)) {
    next();
  } else {
    res.json({ msg: "Tuần bắt đầu phải nhỏ hơn tuần kết thúc" });
  }
}
function check_ca_hoc(req, res, next) {
  const data = req.body;
  if (parseInt(data.ca_bat_dau) < parseInt(data.ca_ket_thuc)) {
    next();
  } else {
    res.json({ msg: "Ca bắt đầu phải nhỏ hơn ca kết thúc" });
  }
}
async function check_ma_hoc_phan(req, res, next) {
  try {
    const hp = await subjects.findOne({
      where: { ma_hoc_phan: req.body.ma_hoc_phan },
    });
    if (!hp) {
      res.json({ msg: "Môn học không tồn tại" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
}
async function find_class(req, res, next) {
  try {
    const id = req.params.id;
    const Class = await class_timetable.findByPk(id);
    if (Class) {
      req.Class = Class;
      next();
    } else {
      res.json({ msg: "Lớp học không tồn tại" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function delete_class(req, res) {
  const id = req.body.id;
  const lop = await class_timetable.findOne({
    where: { id: id },
  });
  try {
    await class_timetable.destroy({
      where: {
        id: id,
      },
    });
    await class_list.destroy({
      where: {
        ma_lop: lop.ma_lop,
      },
    });
    await class_teacher.destroy({
      where: {
        ma_lop: lop.ma_lop,
      },
    });
    await student_timetable.destroy({
      where: {
        ma_lop: lop.ma_lop,
      },
    });
    console.log(lop.ma_lop);
    // res.json({ msg: "Xóa lớp thành công" });
    return res.redirect("/0/view/home/showClass");
  } catch (err) {
    console.log(err);
  }
}
async function update_class(req, res) {
  const data = req.body;
  try {
    await class_timetable.update(
      {
        ma_lop: data.ma_lop,
        ma_hoc_phan: data.ma_hoc_phan,
        ghi_chu: data.ghi_chu,
        ngay_hoc: data.ngay_hoc,
        tuan_bat_dau: data.tuan_bat_dau,
        tuan_ket_thuc: data.tuan_ket_thuc,
        ca_bat_dau: data.ca_bat_dau,
        ca_ket_thuc: data.ca_ket_thuc,
        phong_hoc: data.phong_hoc,
        trang_thai: data.trang_thai,
        so_luong_dang_ky: data.so_luong_dang_ky,
        so_luong_max: data.so_luong_max,
      },
      {
        where: {
          id: req.Class.id,
        },
      }
    );
    // res.json({ msg: "Sửa lớp thành công" });
    return res.redirect("/0/view/home/showClass");
  } catch (err) {
    console.log(err);
  }
}
//done
module.exports = {
  delete_class,
  check_ca_hoc,
  check_ma_hoc_phan,
  check_tuan_hoc,
  add_class,
  update_class,
  find_class,
};
