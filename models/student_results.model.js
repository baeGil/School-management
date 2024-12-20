const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");
const users = require("./users.model");

const results = sequelize.define("Thong tin hoc tap sinh vien", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  hoc_ky: {
    // 20201,20202,...
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  gpa: {
    type: DataTypes.DECIMAL(3),
    defaultValue: null,
  },
  cpa: {
    type: DataTypes.DECIMAL(3),
    defaultValue: null,
  },
  trinh_do: {
    type: DataTypes.STRING(10),
    defaultValue: null,
  },
  muc_canh_cao: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    // 0: muc 0, 1: muc 1, 2: muc 2, 3: muc 3
  },
  tin_chi_tich_luy: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  tin_chi_no: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  so_tcdk_toi_da: {
    type: DataTypes.SMALLINT,
    defaultValue: 24,
  },
});
results.belongsTo(users, { foreignKey: "id_sinh_vien" });
module.exports = results;
