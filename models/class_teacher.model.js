const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");
const class_timetable = require("./class_timetable.model");
const users = require("./users.model");

const class_teacher = sequelize.define("Danh sach giao vien phu trach lop", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  hoc_ky: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
});
class_teacher.belongsTo(users, { foreignKey: "id_giao_vien" });
class_teacher.belongsTo(class_timetable, {
  targetKey: "ma_lop",
  foreignKey: "ma_lop",
});
module.exports = class_teacher;
