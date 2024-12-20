const express = require("express");
const router = express.Router();
const {
  check_password,
  check_username,
  login,
  redirect,
} = require("../controllers/components/login");

router.post("/", check_username, check_password, login, redirect); //done
module.exports = router;
