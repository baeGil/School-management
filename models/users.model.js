const { DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require("../controllers/components/sequelize");

const users = sequelize.define("Thong tin user", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  MS: {
    type: DataTypes.INTEGER,
  },
  ten: {
    type: DataTypes.STRING,
  },
  ngay_sinh: {
    type: DataTypes.DATEONLY,
  },
  nam_vao_truong: {
    type: DataTypes.SMALLINT,
  },
  bac_dao_tao: {
    type: DataTypes.STRING(50),
  },
  chuong_trinh: {
    type: DataTypes.STRING(50),
  },
  tinh_trang_hoc_tap: {
    type: DataTypes.SMALLINT,
    // 0: Thoi hoc, 1: Dang hoc, 2: Bao luu
  },
  gioi_tinh: {
    type: DataTypes.SMALLINT,
    // 0: Nam, 1: Nu
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  dan_toc: {
    type: DataTypes.STRING(20),
  },
  can_cuoc_cong_dan: {
    type: DataTypes.STRING(12),
    // allowNull: false,
  },
  khoa: {
    type: DataTypes.SMALLINT,
  },
  hoc_ham: {
    type: DataTypes.SMALLINT,
    // 0: Khong co, 1: GS, 2: PGS
  },
  hoc_vi: {
    type: DataTypes.STRING(50),
  },
  ten_dang_nhap: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  mat_khau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    // 0: admin, 1: student, 2: teacher
  },
});
module.exports = users;
