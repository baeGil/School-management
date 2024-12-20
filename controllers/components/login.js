const { Op } = require("sequelize");
const users = require("../../models/users.model");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("./generateAccessToken");

async function check_username(req, res, next) {
  try {
    const data = req.body;
    const user = await users.findOne({
      where: {
        [Op.and]: [{ ten_dang_nhap: data.ten_dang_nhap }, { role: data.role }],
      },
    });
    if (user) {
      req.data = user;
      next();
    } else {
      res.json({ msg: "Sai tên đăng nhập" });
    }
  } catch (err) {
    console.log(err);
  }
}
async function check_password(req, res, next) {
  try {
    const valid = bcrypt.compareSync(req.body.mat_khau, req.data.mat_khau);
    if (valid) {
      next();
    } else {
      res.json({ msg: "Sai mật khẩu" });
    }
  } catch (err) {
    console.log(err);
  }
}
async function login(req, res, next) {
  const user = { id: req.data.id, role: req.data.role };
  try {
    const Token = generateAccessToken(user, 86400);
    res.cookie("jwt", Token, {
      httpOnly: true,
      maxAge: 86400 * 1000,
    });
    req.role = req.data.role;
    req.id = req.data.id;
    next();
  } catch (err) {
    console.log(err);
  }
}
function redirect(req, res, next) {
  const role = req.role;
  const id = req.id;
  const url = `/${role}/${id}/view/home`;
  // res.json({ msg: url });
  return res.redirect(url);
}
module.exports = { check_password, check_username, login, redirect };
