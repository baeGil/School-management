const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");
const subjects = require("./subjects.model");
const users = require("./users.model");

const score = sequelize.define("Diem thi", {
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
  diem_qua_trinh: {
    type: DataTypes.DECIMAL(4, 2),
  },
  diem_thi: {
    type: DataTypes.DECIMAL(4, 2),
  },
});
score.belongsTo(users, { foreignKey: "id_sinh_vien" });
score.belongsTo(subjects, {
  targetKey: "ma_hoc_phan",
  foreignKey: "ma_hoc_phan",
});
module.exports = score;
