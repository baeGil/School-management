const bcrypt = require("bcrypt");
const users = require("../../models/users.model");
async function check_admin(req, res, next) {
  try {
    const username = "hainam";
    const password = bcrypt.hashSync("12345678", 10);
    const admin = await users.findOne({
      where: {
        role: 0,
      },
    });
    if (!admin) {
      console.log("Không có admin, đang tạo admin...");
      await users.create({
        ten_dang_nhap: username,
        mat_khau: password,
        role: 0,
      });
      console.log("Tạo admin thành công");
    } else {
      console.log("Có admin");
    }
    console.log("username: " + username);
    console.log("password: 12345678");
  } catch (err) {
    console.log(err);
  }
}
//done
module.exports = { check_admin };
