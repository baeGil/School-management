const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");
const subjects = require("./subjects.model");
const class_time = require("./class_time.model");

const class_timetable = sequelize.define("Thoi khoa bieu", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  ma_lop: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  ghi_chu: {
    type: DataTypes.STRING(50),
  },
  ngay_hoc: {
    type: DataTypes.ENUM,
    values: ["2", "3", "4", "5", "6", "7"],
  },
  tuan_bat_dau: {
    type: DataTypes.SMALLINT,
  },
  tuan_ket_thuc: {
    type: DataTypes.SMALLINT,
  },
  phong_hoc: {
    type: DataTypes.STRING(10),
  },
  trang_thai: {
    type: DataTypes.SMALLINT,
    // 0: Dong dang ky, 1: Mo dang ky
  },
  so_luong_dang_ky: {
    type: DataTypes.SMALLINT,
  },
  so_luong_max: {
    type: DataTypes.SMALLINT,
  },
  trang_thai_gv: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    // 0: k co gv, 1: co gv
  },
});
class_timetable.belongsTo(subjects, {
  targetKey: "ma_hoc_phan",
  foreignKey: "ma_hoc_phan",
});
class_timetable.belongsTo(class_time, {
  targetKey: "ca_hoc",
  foreignKey: "ca_bat_dau",
});
class_timetable.belongsTo(class_time, {
  targetKey: "ca_hoc",
  foreignKey: "ca_ket_thuc",
});
module.exports = class_timetable;
