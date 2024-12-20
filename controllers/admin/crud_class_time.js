const class_time = require("../../models/class_time.model");

async function add_time(req, res) {
  const data = req.body;
  try {
    await class_time.create({
      ca_hoc: data.ca_hoc,
      gio_bat_dau: data.gio_bat_dau,
      gio_ket_thuc: data.gio_ket_thuc,
    });
    res.json({ msg: "Thành công" });
  } catch (err) {
    console.log(err);
  }
}
module.exports = { add_time };
