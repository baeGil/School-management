const { Op } = require("sequelize");
const users = require("../../models/users.model");
const student_results = require("../../models/student_results.model");

const _ = require("lodash");
const bcrypt = require("bcrypt");

async function handle_ms(req, res, next) {
  try {
    const data = req.body;
    const user = await users.findAll({
      where: {
        [Op.and]: [
          { nam_vao_truong: data.nam_vao_truong },
          { role: data.role },
        ],
      },
    });
    if (user.length == 0) {
      req.ms = data.nam_vao_truong * 10000;
      next();
    } else {
      req.ms = _.max(user.map((data) => data.MS)) + 1;
      next();
    }
  } catch (err) {
    console.log(err);
  }
}

async function check_existed(req, res, next) {
  try {
    const data = req.body;
    const user = await users.findOne({
      where: {
        [Op.or]: [
          { email: data.email },
          { can_cuoc_cong_dan: data.can_cuoc_cong_dan },
        ],
      },
    });
    if (user) {
      res.json({ msg: "Đã tồn tại" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
}
function zerofill_dob(req, res, next) {
  const data = req.body;
  if (data.ngay_sinh == null) {
    next();
  } else {
    const dob = data.ngay_sinh.split("/");
    const result = _.reverse([
      ...dob
        .filter((data) => data.length != 4)
        .map((data) => {
          if (data.length == 1) return "0" + data;
          else return data;
        }),
      dob[2],
    ]).join("-");
    req.dob = result;
    next();
  }
}

async function signup_user(req, res, next) {
  try {
    const data = req.body;
    const user = await users.create({
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
      khoa: data.role == 1 ? parseInt(data.nam_vao_truong) - 1955 : null,
      hoc_ham: data.hoc_ham,
      hoc_vi: data.hoc_vi,
      ten_dang_nhap: req.ms,
      mat_khau: bcrypt.hashSync(data.can_cuoc_cong_dan, 10),
      role: data.role,
    });
    if (data.role == 1) {
      await student_results.create({
        id_sinh_vien: user.id,
        hoc_ky: 20242,
        trinh_do: "Năm 1",
      });
    }
    return res.redirect("/0/view/home/showUser");
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  handle_ms,
  check_existed,
  zerofill_dob,
  signup_user,
};
