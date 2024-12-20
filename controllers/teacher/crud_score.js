const { Op } = require("sequelize");
const score = require("../../models/score.model");
const users = require("../../models/users.model");
const student_timetable = require("../../models/student_timetable.model");
const subjects = require("../../models/subjects.model");

// nhap diem hoc sinh
// input: diem, ma lop, ma hp, mssv
async function nhap_diem(req, res, next) {
  const data = req.body;
  const sv = await users.findOne({
    where: {
      [Op.and]: [{ MS: data.mssv }, { role: 1 }],
    },
  });
  const mon_hoc = await subjects.findOne({
    where: { ma_hoc_phan: data.ma_hoc_phan },
  });
  // tinh diem so, diem chu
  const diem_so =
    data.diem_qua_trinh * mon_hoc.trong_so_qua_trinh +
    mon_hoc.trong_so_cuoi_ky * data.diem_thi;
  var diem_chu;
  switch (true) {
    case diem_so < 4:
      diem_chu = "F";
      break;
    case diem_so >= 4 && diem_so < 5:
      diem_chu = "D";
      break;
    case diem_so >= 5 && diem_so < 5.5:
      diem_chu = "D+";
      break;
    case diem_so >= 5.5 && diem_so < 6:
      diem_chu = "C";
      break;
    case diem_so >= 6 && diem_so < 6.5:
      diem_chu = "C+";
      break;
    case diem_so >= 6.5 && diem_so < 7.5:
      diem_chu = "B";
      break;
    case diem_so >= 7.5 && diem_so < 8.5:
      diem_chu = "B+";
      break;
    case diem_so >= 8.5 && diem_so < 9.5:
      diem_chu = "A";
      break;
    case diem_so >= 9.5:
      diem_chu = "A+";
      break;
  }
  if (!sv) {
    res.json({ msg: "Khong tim thay hoc sinh" });
  } else if (
    data.diem_qua_trinh <= 10 &&
    data.diem_qua_trinh >= 0 &&
    data.diem_thi >= 0 &&
    data.diem_thi <= 10
  ) {
    await score.create({
      hoc_ky: data.hoc_ky,
      diem_qua_trinh: data.diem_qua_trinh,
      diem_thi: data.diem_thi,
      ma_hoc_phan: data.ma_hoc_phan,
      id_sinh_vien: sv.id,
    });
    await student_timetable.update(
      {
        diem_chu: diem_chu,
      },
      {
        where: {
          [Op.and]: [
            { id_sinh_vien: sv.id },
            { ma_lop: data.ma_lop },
            { hoc_ky: data.hoc_ky },
          ],
        },
      }
    );
    res.json({ msg: "Nhap diem thanh cong" });
    next();
    // res.json({ msg: "Nhap diem thanh cong" });
  } else {
    res.json({ msg: "Diem thi khong hop le" });
  }
}
async function add_score(req, res, next) {
  var data = req.body;
  var obj = {
    id_sinh_vien: data.id_sinh_vien,
    diem_qua_trinh: data.diem_qua_trinh,
    diem_thi: data.diem_thi,
    hoc_ky: data.hoc_ky,
    ma_hoc_phan: data.ma_hoc_phan,
  };
  try {
    for (var i = 0; i < obj.id_sinh_vien.length; i++) {
      await score.update(
        {
          diem_qua_trinh: obj.diem_qua_trinh[i],
          diem_thi: obj.diem_thi[i],
        },
        {
          where: {
            [Op.and]: [
              { hoc_ky: obj.hoc_ky[0] },
              { id_sinh_vien: obj.id_sinh_vien[i] },
              {
                ma_hoc_phan: obj.ma_hoc_phan[i],
              },
            ],
          },
        }
      );
    }

    return res.redirect(`/2/${req.user.id}/view/detailClass/${data.ma_lop[0]}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { nhap_diem, add_score };
