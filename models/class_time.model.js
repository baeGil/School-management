const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");

const class_time = sequelize.define("Thoi gian ca hoc", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  ca_hoc: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    unique: true,
  },
  gio_bat_dau: {
    type: DataTypes.TIME,
    unique: true,
  },
  gio_ket_thuc: {
    type: DataTypes.TIME,
    unique: true,
  },
});
module.exports = class_time;
