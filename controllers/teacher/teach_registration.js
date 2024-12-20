const class_timetable = require("../../models/class_timetable.model");
const _ = require("lodash");
const { Op } = require("sequelize");
const class_teacher = require("../../models/class_teacher.model");

// tim lop
async function check_class(req, res, next) {
  try {
    const data = req.body;
    // tim lop hoc ung voi ma lop
    const Class = await class_timetable.findOne({
      where: {
        [Op.and]: [{ ma_lop: data.ma_lop }, { trang_thai_gv: 0 }],
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
}

async function check_trung_TKB(req, res, next) {
  // tim danh sach lop cua giao vien
  const ds = await class_teacher.findAll({
    where: { id_giao_vien: req.user.id },
  });
  const ma_lop_arr = ds.map((data) => data.ma_lop);
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
    // neu tkb giao vien k co mon nao thi khong bi trung
    if (ds.length == 0) {
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
}

async function teach_registration(req, res) {
  const data = req.body;
  try {
    // them lop hoc vao danh sach lop cua giao vien
    await class_teacher.create({
      hoc_ky: data.hoc_ky,
      id_giao_vien: req.user.id,
      ma_lop: req.Class.ma_lop,
    });
    // Doi trang thai giao vien thanh 1
    await class_timetable.update(
      {
        trang_thai_gv: 1,
      },
      {
        where: {
          ma_lop: req.Class.ma_lop,
        },
      }
    );
    return res.redirect(`/2/${req.user.id}/view/registration`);
  } catch (err) {
    console.log(err);
  }
}
async function show_tkb(req, res, next) {
  try {
    // tim danh sach lop trong danh sach lop giao vien
    const tkb_sv = await class_teacher.findAll({
      where: {
        id_giao_vien: req.user.id,
      },
    });
    const ma_lop_arr = tkb_sv.map((data) => data.ma_lop);

    // tim thong tin lop trong ds lop gv
    const tkb = await class_timetable.findAll({
      where: {
        ma_lop: {
          [Op.in]: ma_lop_arr,
        },
      },
    });
    // tim ma hoc phan
    const ma_hp_arr = tkb.map((data) => data.ma_hoc_phan);
    const data = {
      so_luong_lop: tkb_sv.length,
      tkb: tkb,
    };
    req.data = data;
    // res.json({ data });
    next();
  } catch (err) {
    console.log(err);
  }
}

async function delete_class(req, res) {
  const data = req.body;
  try {
    // xoa lop hoc khoi ds lop gv
    await class_teacher.destroy({
      where: {
        [Op.and]: { id_giao_vien: data.id_giao_vien, ma_lop: data.ma_lop },
      },
    });

    // // Doi trang thai giao vien thanh 0
    await class_timetable.update(
      {
        trang_thai_gv: 0,
      },
      {
        where: {
          ma_lop: data.ma_lop,
        },
      }
    );
    return res.redirect(`/2/${req.user.id}/view/registration`);
  } catch (err) {
    console.log(err);
  }
} // teacher

module.exports = {
  teach_registration,
  check_trung_TKB,
  check_class,
  show_tkb,
  delete_class,
};
