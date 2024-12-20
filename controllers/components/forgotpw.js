const User = require("../../models/users.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateAccessToken } = require("./generateAccessToken");
require("dotenv").config();
const bcrypt = require("bcrypt");

async function sendEmail(email, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.Host,
      service: process.env.Service,
      port: 587,
      secure: false,
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail({
      from: process.env.Email,
      to: email,
      subject: subject,
      html: htmlContent,
    });
    console.log("Gửi email thành công!");
  } catch (error) {
    console.log(error, "Gửi email thất bại!");
  }
}

async function sendLink(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.json({
        error: true,
        message: "User with given email does not exist",
      });
    } else {
      const emailToken = generateAccessToken(user.email, 3000);
      res.cookie("emailToken", emailToken, {
        httpOnly: true,
        maxAge: 3000 * 1000,
      });
      const url = `${process.env.Base_url}/resetPassword/${emailToken}`;
      await sendEmail(
        user.email,
        "Khôi  phục mật khẩu",
        "Đường link khôi phục mật khẩu của bạn sẽ có hiệu lực trong 5 phút: " +
          url
      );
      res.json({
        error: false,
        message: "Gửi email thành công!",
      });
    }
  } catch (err) {
    res.send("An error occured");
    console.log(err);
  }
}

function checkLink(req, res, next) {
  const emailToken = req.cookies.emailToken;
  if (emailToken) {
    jwt.verify(
      emailToken,
      process.env.Access_token_secret,
      (err, decodedToken) => {
        if (err) {
          res.json({ error: true, msg: "Expired link" });
        } else {
          if (emailToken != req.params.emailToken)
            return res.json({ error: true, msg: "Invalid link" });
          req.email = decodedToken.data;
          next();
        }
      }
    );
  } else {
    res.json({ error: true, msg: "Invalid/Expired link" });
  }
}

async function reset_password(req, res, next) {
  const data = req.body;
  if (data.mat_khau != data.cf_mat_khau) {
    res.json({ error: true, msg: "Mật khẩu không trùng khớp" });
  } else {
    const user = await User.findOne({
      where: {
        email: req.email,
      },
    });
    user.mat_khau = bcrypt.hashSync(data.mat_khau, 10);
    await user.save();
    res.json({ error: false, msg: "Đổi mật khẩu thành công" });
  }
}

async function change_password(req, res, next) {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });
  const data = req.body;
  if (data.mat_khau != data.cf_mat_khau) {
    res.json({ msg: "Mật khẩu không trùng khớp" });
  } else if (bcrypt.compareSync(data.mat_khau, user.mat_khau)) {
    res.json({ error: true, msg: "Mật khẩu mới phải khác so với mật khẩu cũ" });
  } else {
    user.mat_khau = bcrypt.hashSync(data.mat_khau, 10);
    await user.save();
    res.json({ error: false, msg: "Đổi mật khẩu thành công" });
  }
}
module.exports = { sendLink, checkLink, change_password, reset_password };
