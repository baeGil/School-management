const express = require("express");
const {
  reset_password,
  checkLink,
  sendLink,
} = require("../controllers/components/forgotpw");

const router = express.Router();
router.post("/:emailToken", checkLink, reset_password);
router.post("/", sendLink);
// exports router
module.exports = router;
