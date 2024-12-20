const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");

const subjects = sequelize.define("Thong tin mon hoc", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  ma_hoc_phan: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  ten_hoc_phan: {
    type: DataTypes.STRING(50),
  },
  so_tc_dang_ky: {
    type: DataTypes.SMALLINT,
  },
  so_tc_hoc_phi: {
    type: DataTypes.SMALLINT,
  },
  hoc_phi_mot_tc: {
    type: DataTypes.INTEGER,
  },
  trong_so_qua_trinh: {
    type: DataTypes.DECIMAL(2, 1),
  },
  trong_so_cuoi_ky: {
    type: DataTypes.DECIMAL(2, 1),
  },
});

module.exports = subjects;
