const subjects = require("../../models/subjects.model");

async function add_subject(req, res) {
  try {
    const data = req.body;
    const subject = await subjects.findOne({
      where: { ma_hoc_phan: data.ma_hoc_phan },
    });
    if (!subject) {
      await subjects.create({
        ma_hoc_phan: data.ma_hoc_phan,
        ten_hoc_phan: data.ten_hoc_phan,
        so_tc_dang_ky: data.so_tc_dang_ky,
        so_tc_hoc_phi: data.so_tc_hoc_phi,
        hoc_phi_mot_tc: data.hoc_phi_mot_tc,
        trong_so_qua_trinh: data.trong_so_qua_trinh,
        trong_so_cuoi_ky: data.trong_so_cuoi_ky,
      });
      return res.redirect("/0/view/home/showSubject");
      // res.json({ msg: "Thêm môn học thành công" });
    } else {
      res.json({
        msg: "Môn học đã có",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
async function check_trong_so(req, res, next) {
  try {
    const data = req.body;
    if (
      parseFloat(data.trong_so_cuoi_ky) + parseFloat(data.trong_so_qua_trinh) ==
      1
    ) {
      next();
    } else {
      console.log("Loi trong so");
      return res.json({ msg: "Trọng số không hợp lệ" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function find_subject(req, res, next) {
  try {
    const id = req.params.id;
    const subject = await subjects.findByPk(id);
    if (subject) {
      req.subject = subject;
      next();
    } else {
      res.json({ msg: "Môn học không tồn tại" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function update_subject(req, res) {
  const data = req.body;
  try {
    await subjects.update(
      {
        ma_hoc_phan: data.ma_hoc_phan,
        ten_hoc_phan: data.ten_hoc_phan,
        so_tc_dang_ky: data.so_tc_dang_ky,
        so_tc_hoc_phi: data.so_tc_hoc_phi,
        hoc_phi_mot_tc: data.hoc_phi_mot_tc,
        trong_so_qua_trinh: data.trong_so_qua_trinh,
        trong_so_cuoi_ky: data.trong_so_cuoi_ky,
      },
      {
        where: {
          id: req.subject.id,
        },
      }
    );
    // res.json({ msg: "Sửa môn học thành công" });
    return res.redirect("/0/view/home/showSubject");
  } catch (error) {
    console.log(error);
  }
}
async function delete_subject(req, res) {
  const id = req.body.id;
  try {
    await subjects.destroy({
      where: {
        id: id,
      },
    });
    // res.json({ msg: "Xóa môn học thành công" });
    return res.redirect("/0/view/home/showSubject");
  } catch (error) {
    console.log(error);
  }
}
//done
module.exports = {
  add_subject,
  check_trong_so,
  update_subject,
  delete_subject,
  find_subject,
};
