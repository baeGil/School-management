const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Demo1", "postgres", "200418", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: false,
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };
