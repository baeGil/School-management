const jwt = require("jsonwebtoken");
const users = require("../../models/users.model");
require("dotenv").config();
function check_token(req, res, next) {
  const Token = req.cookies.jwt;
  if (Token) {
    jwt.verify(Token, process.env.Access_token_secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // req.user = null;
        // next();
        return res.redirect("/view/login");
      } else {
        req.user = decodedToken.data;
        // console.log(decodedToken.data);
        next();
      }
    });
  } else {
    // req.user = null;
    console.log("No token");
    // next();
    return res.redirect("/view/login");
  }
}

// function is_null(req, res, next) {
//   if (req.user == null) next();
// }

function is_admin(req, res, next) {
  if (req.user.role != 0) res.json({ msg: "Bạn không có quyền" });
  else next();
}

function is_student(req, res, next) {
  if (req.user.role != 1) res.json({ msg: "Bạn không có quyền" });
  else next();
}

function is_teacher(req, res, next) {
  if (req.user.role != 2) res.json({ msg: "Bạn không có quyền" });
  else next();
}

function block_site(req, res, next) {
  const Token = req.cookies.jwt;
  if (Token) {
    jwt.verify(Token, process.env.Access_token_secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        next();
      } else {
        // req.user = decodedToken.data;
        res.redirect(
          `/${decodedToken.data.role}/${decodedToken.data.id}/view/home`
        );
      }
    });
  } else {
    next();
  }
}

// change password
async function changePassword(req, res, next) {
  const id = req.params.id;
  const data = await users.bulkCreate([], { updateOnDuplicate: [] });
}

module.exports = {
  check_token,
  is_admin,
  is_student,
  is_teacher,
  block_site,
};
