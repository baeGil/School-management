const class_timetable = require("../../models/class_timetable.model");
const { Op } = require("sequelize");
// hoc sinh
async function find_class(req, res) {
  const ma_lop = req.body.ma_lop;
  try {
    const data = await class_timetable.findOne({
      where: {
        [Op.and]: [{ ma_lop: ma_lop }, { trang_thai_gv: 1 }],
      },
    });
    if (!data) res.json({ msg: "Khong tim thay lop" });
    else res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
}

// giao vien
async function find_class1(req, res) {
  const ma_lop = req.body.ma_lop;
  try {
    const data = await class_timetable.findOne({
      where: {
        [Op.and]: [{ ma_lop: ma_lop }, { trang_thai_gv: 0 }],
      },
    });
    if (!data) res.json({ msg: "Khong tim thay lop" });
    else res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
}
module.exports = { find_class, find_class1 };
