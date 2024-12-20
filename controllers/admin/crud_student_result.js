const results = require("../../models/student_results.model");
const student_timetable = require("../../models/student_timetable.model");
const users = require("../../models/users.model");
const _ = require("lodash");

async function tinh_result(req, res, next) {
  // input: mssv, hoc ky
  const data = req.body;
  const sv = await users.findOne({ where: { MS: data.mssv } });
  const mon_trong_1_ky = await student_timetable.findAll({
    where: { id_sinh_vien: sv.id, hoc_ky: data.hoc_ky },
  });
  const tat_ca_mon = await student_timetable.findAll({
    where: { id_sinh_vien: sv.id },
    order: [["ky_hoc", "ASC"]],
  });
  var he_so;
  const all_tc = _.sum(mon_trong_1_ky.map((data) => data.so_tc_dang_ky));
  const add_he_so = mon_trong_1_ky.map(function (e) {
    switch (e.diem_chu) {
      case "F":
        he_so = 0;
        break;
      case "D":
        he_so = 1;
        break;
      case "D+":
        he_so = 1.5;
        break;
      case "C":
        he_so = 2;
        break;
      case "C+":
        he_so = 2.5;
        break;
      case "B":
        he_so = 3;
        break;
      case "B+":
        he_so = 3.5;
        break;
      case "A":
        he_so = 4;
        break;
      case "A+":
        he_so = 4;
        break;
    }
    e.he_so = he_so;
  });
  // tinh gpa
  const gpa =
    _.sum(add_he_so.map((data) => data.he_so * data.so_tc_dang_ky)) / all_tc;
  // tinh tc tich luy 1 ky
  const tc_tich_luy_1_ky = _.sum(
    mon_trong_1_ky
      .filter((data) => data.diem_chu != "F")
      .map((data) => data.so_tc_dang_ky)
  );
  // tinh tc tich luy cac ky
  const tc_tich_luy_cac_ky = _.sum(
    tat_ca_mon
      .filter((data) => data.diem_chu != "F")
      .map((data) => data.so_tc_dang_ky)
  );
  // tinh tc no 1 ky
  const tc_no_1_ky = _.sum(
    mon_trong_1_ky
      .filter((data) => data.diem_chu == "F")
      .map((data) => data.so_tc_dang_ky)
  );
  // tinh tc no cac ky
  const tc_no_cac_ky = _.sum(
    tat_ca_mon
      .filter((data) => data.diem_chu == "F")
      .map((data) => data.so_tc_dang_ky)
  );
  const result = await results.create({
    hoc_ky: data.hoc_ky,
    gpa: gpa,
    tin_chi_tich_luy: tc_tich_luy_cac_ky,
    tin_chi_no: tc_no_cac_ky,
    id_sinh_vien: sv.id,
  });
  await result.increment("ky_hoc");
  // handle muc canh cao
  if (
    tat_ca_mon[tat_ca_mon.length - 1].muc_canh_cao == 0 ||
    tat_ca_mon.length == 0
  ) {
    await result.update({
      muc_canh_cao:
        tc_no_cac_ky > 24 ? 3 : tc_no_cac_ky > 16 ? 2 : tc_no_1_ky > 8 ? 1 : 0,
    });
  } else {
    if (tc_no_1_ky <= 4) {
      await result.decrement("muc_canh_cao");
    }
    await result.update({
      muc_canh_cao: tc_no_cac_ky > 24 ? 3 : tc_no_cac_ky > 16 ? 2 : 1,
    });
  }
  // handle so tin chi dang ky toi da
  await result.update({
    so_tcdk_toi_da:
      result.muc_canh_cao == 1 || result.muc_canh_cao == 2
        ? 14
        : result.muc_canh_cao == 3
        ? 8
        : 24,
  });
  res.json({ msg: "Cap nhat thanh cong" });
}
module.exports = { tinh_result };
