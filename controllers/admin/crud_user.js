const result = require("../../models/student_results.model");
const class_list = require("../../models/class_list.model");
const score = require("../../models/score.model");
const users = require("../../models/users.model");
const bcrypt = require("bcrypt");
const class_timetable = require("../../models/class_timetable.model");
const student_timetable = require("../../models/student_timetable.model");
const { Op } = require("sequelize");
const class_teacher = require("../../models/class_teacher.model");

async function update_user(req, res) {
  try {
    const data = req.body;
    await users.update(
      {
        MS: req.ms,
        ten: data.ten,
        ngay_sinh: req.dob,
        nam_vao_truong: data.nam_vao_truong,
        bac_dao_tao: data.bac_dao_tao,
        chuong_trinh: data.chuong_trinh,
        tinh_trang_hoc_tap: data.tinh_trang_hoc_tap,
        gioi_tinh: data.gioi_tinh,
        email: data.email,
        dan_toc: data.dan_toc,
        can_cuoc_cong_dan: data.can_cuoc_cong_dan,
        khoa: data.role == 1 ? data.nam_vao_truong - 1955 : null,
        hoc_ham: data.hoc_ham,
        hoc_vi: data.hoc_vi,
        ten_dang_nhap: req.ms,
        mat_khau: bcrypt.hashSync(data.can_cuoc_cong_dan, 10),
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    // res.json({ msg: "Sua thanh cong" });
    return res.redirect("/0/view/home/showUser");
  } catch (err) {
    console.log(err);
  }
}
async function find_user(req, res, next) {
  try {
    const id = req.params.id;
    const user = await users.findByPk(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.json({ msg: "User khong ton tai" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function delete_user(req, res) {
  const id = req.body.id;
  try {
    // tìm role
    const user = await users.findOne({
      where: {
        id: id,
      },
    });
    // tìm danh sách lớp hs đã đki trong thời khóa biểu
    const lop1 = await student_timetable.findAll({
      where: {
        id_sinh_vien: id,
      },
    });
    const lop1_arr = lop1.map((data) => data.ma_lop);
    // xóa khỏi danh sách ng dùng
    await users.destroy({
      where: {
        id: id,
      },
    });
    if (user.role == 1) {
      // xóa khỏi danh sách lớp
      await class_list.destroy({
        where: {
          id: id_sinh_vien,
        },
      });
      // xóa khỏi danh sách điểm
      await score.destroy({
        where: {
          id: id_sinh_vien,
        },
      });
      // xóa khỏi thông tin học tập sinh viên
      await result.destroy({
        where: {
          id: id_sinh_vien,
        },
      });
      // xóa khỏi TKB sinh viên
      await users.destroy({
        where: {
          id: id_sinh_vien,
        },
      });
    }
    // -1 Vào các lớp
    await class_timetable.decrement("so_luong_dang_ky", {
      by: 1,
      where: {
        ma_lop: {
          [Op.in]: lop1_arr,
        },
      },
    });
    if (user.role == 2) {
      // xoa khoi lop giao vien
      await class_teacher.destroy({
        where: {
          id_giao_vien: id,
        },
      });
    }
    const lop2 = await class_teacher.findAll({
      where: {
        id_giao_vien: id,
      },
    });
    const lop2_arr = lop1.map((data) => data.ma_lop);
    await class_timetable.decrement("trang_thai_gv", {
      by: 1,
      where: {
        ma_lop: {
          [Op.in]: lop2_arr,
        },
      },
    });
    // res.json({ msg: "Xóa user thành công" });
    return res.redirect("/0/view/home/showUser");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { find_user, update_user, delete_user };
