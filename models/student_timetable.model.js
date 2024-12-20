const { DataTypes } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");
const users = require("./users.model");
const class_timetable = require("./class_timetable.model");

const student_timetable = sequelize.define("TKB sinh vien", {
  hoc_ky: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  so_tc_dang_ky: {
    type: DataTypes.SMALLINT,
  },
  diem_chu: {
    type: DataTypes.STRING(2),
    defaultValue: null,
  },
});
student_timetable.belongsTo(users, {
  foreignKey: "id_sinh_vien",
});
student_timetable.belongsTo(class_timetable, {
  targetKey: "ma_lop",
  foreignKey: "ma_lop",
});
module.exports = student_timetable;
