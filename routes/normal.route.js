const express = require("express");
const { find_class, find_class1 } = require("../controllers/components/normal");
const router = express.Router();

router.post("/find_class", find_class); // done
router.post("/find_class1", find_class1);
module.exports = router;
