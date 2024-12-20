const class_time = require("../../models/class_time.model");
const class_timetable = require("../../models/class_timetable.model");
const subjects = require("../../models/subjects.model");

async function search_class(req, res) {
  try {
    const ma_lop = req.body.ma_lop;
    const lop_hoc = await class_timetable.findByPk(ma_lop);
    if (lop) {
      const mon_hoc = await subjects.findByPk(lop_hoc.ma_hoc_phan);
      const gio_bat_dau = await class_time.findByPk(lop_hoc.ca_bat_dau);
      const gio_ket_thuc = await class_time.findByPk(lop_hoc.ca_ket_thuc);
      // res.json({
      //   ma_lop: ma_lop,
      //   ma_hoc_phan: mon_hoc.ma_hoc_phan,
      //   ten_hoc_phan: mon_hoc.ten_hoc_phan,
      //   tuan_bat_dau: lop_hoc.tuan_bat_dau,
      //   tuan_ket_thuc: lop_hoc.tuan_ket_thuc,
      //   ngay_hoc: lop_hoc.ngay_hoc,
      //   gio_hoc: `${gio_bat_dau.gio_bat_dau}-${gio_ket_thuc.gio_ket_thuc}`,
      //   phong_hoc: lop_hoc.phong_hoc,
      //   so_tc_dang_ky: mon_hoc.so_tin_chi_dang_ky,
      // });
      res.json({ lop });
    } else {
      res.json({ msg: "Khong tim thay lop" });
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { search_class };
