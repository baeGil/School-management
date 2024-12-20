const { Op } = require("sequelize");
const score = require("../../models/score.model");
const subjects = require("../../models/subjects.model");

// show bang diem: ma hoc phan, diem qua trinh, diem thi, diem chu, diem so
async function show_score(req, res, next) {
  try {
    const result = await score.findAll({
      where: {
        id_sinh_vien: req.user.id,
      },
      order: [["ma_hoc_phan", "ASC"]],
    });
    if (result) {
      const ma_hp_arr = result.map((data) => data.ma_hoc_phan);
      const ten_hoc_phan = await subjects.findAll({
        where: {
          ma_hoc_phan: {
            [Op.in]: ma_hp_arr,
          },
        },
        order: [["ma_hoc_phan", "ASC"]],
      });
      // console.log(ten_hoc_phan);
      req.ten_hoc_phan = ten_hoc_phan;
      req.result = result;
      next();
    } else {
      res.json({ msg: "Khong co mon hoc" });
      next();
    }
    // res.json({ ma_hoc_phan: result });
  } catch (err) {
    console.log(err);
  }
}
module.exports = { show_score };
