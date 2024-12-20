const { Op } = require("sequelize");
const class_list = require("../../models/class_list.model");
const users = require("../../models/users.model");

async function update_list(req, res) {
  try {
    const data = req.body;
    await class_list.update(
      {
        hoc_ky: data.hoc_ky,
        ma_hoc_phan: data.ma_hoc_phan,
        ma_lop: data.ma_lop,
        id_sinh_vien: data.id_sinh_vien,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    res.json({ msg: "Sửa thành công" });
  } catch (err) {
    console.log(err);
  }
}

async function find_class(req, res, next) {
  try {
    const ma_lop = req.params.ma_lop;
    const Class = await class_list.findAll({
      where: {
        ma_lop: ma_lop,
      },
    });
    if (Class) {
      req.Class = Class;
      next();
    } else {
      res.json({ msg: "Không có lớp" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function find_student(req, res, next) {
  try {
    const id = req.body.id;
    const ma_lop = req.body.ma_lop;
    const student = await class_list.findAll({
      where: {
        [Op.and]: [{ ma_lop: ma_lop }, { id_sinh_vien: id }],
      },
    });
    if (student) {
      req.student = student;
      next();
    } else {
      res.json({ msg: "Học sinh không có trong lớp này" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function delete_student(req, res) {
  try {
    await class_list.destroy({
      where: {
        [Op.and]: [
          { id_sinh_vien: req.student.id_sinh_vien },
          { ma_lop: req.student.ma_lop },
        ],
      },
    });
    res.json({ msg: "Xóa học sinh thành công" });
  } catch (err) {
    console.log(err);
  }
}

async function delete_class(req, res) {
  try {
    await class_list.destroy({
      where: {
        ma_lop: req.Class.ma_lop,
      },
    });
    res.json({ msg: "Xóa lớp thành công" });
  } catch (err) {
    console.log(err);
  }
}

async function update_class(req, res) {
  const ma_lop = req.params.ma_lop;
  try {
    const Class = class_list.findAll({ where: { ma_lop: ma_lop } });
    if (Class) {
      await class_list.update({});
    }
    await class_list.update({});
  } catch (err) {
    console.log(err);
  }
}

async function add_student(req, res) {
  try {
    const data = req.body;
    const ds = await class_list.findOne({
      where: {
        [Op.and]: [
          { id_sinh_vien: data.id_sinh_vien },
          { ma_lop: data.ma_lop },
        ],
      },
    });
    if (!ds) {
      await class_list.create({
        hoc_ky: data.hoc_ky,
        id_sinh_vien: data.id_sinh_vien,
        ma_lop: data.ma_lop,
      });
      res.json({ msg: "Thêm học sinh vào lớp thành công" });
    } else {
      res.json({ msg: "Học sinh đã ở trong lớp" });
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { add_student };
