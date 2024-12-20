// const { Op } = require("sequelize");
// const teachers = require("../../models/teachers.model");
// const _ = require("lodash");

// async function check_existed(req, res, next) {
//   try {
//     const data = req.body;
//     const teacher = await teachers.findOne({
//       where: {
//         [Op.or]: [
//           { email: data.email },
//           { can_cuoc_cong_dan: data.can_cuoc_cong_dan },
//         ],
//       },
//     });
//     if (teacher) {
//       res.json({ msg: "Teacher existed" });
//     } else {
//       next();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// function zerofill_dob(req, res, next) {
//   const data = req.body;
//   if (data.ngay_sinh == null) {
//     next();
//   } else {
//     const dob = data.ngay_sinh.split("/");
//     const result = [
//       ...dob
//         .filter((data) => data.length != 4)
//         .map((data) => {
//           if (data.length == 1) return "0" + data;
//           else return data;
//         }),
//       dob[2],
//     ].join("/");
//     req.dob = result;
//     res.json({ msg: "done" });
//     next();
//   }
// }
// async function handle_msgv(req, res, next) {
//   try {
//     const data = req.body;
//     const teacher = await teachers.findAll({
//       where: {
//         nam_vao_truong: data.nam_vao_truong,
//       },
//     });
//     if (teacher.length == 0) {
//       req.MSGV = data.nam_vao_truong * 10000;
//       next();
//     } else {
//       req.MSGV = _.max(teacher.map((data) => data.MSGV)) + 1;
//       next();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// async function add_info(req, res) {
//   try {
//     const data = req.body;
//     await teachers.create({
//       MSGV: req.MSGV,
//       ten: data.ten,
//       ngay_sinh: req.dob,
//       nam_vao_truong: data.nam_vao_truong,
//       gioi_tinh: data.gioi_tinh,
//       email: data.email,
//       dan_toc: data.dan_toc,
//       can_cuoc_cong_dan: data.can_cuoc_cong_dan,
//       hoc_ham: data.hoc_ham,
//       hoc_vi: data.hoc_vi,
//     });
//     res.json({ msg: "Tao thanh cong" });
//   } catch (err) {
//     console.log(err);
//   }
// }
// module.exports = { check_existed, handle_msgv, add_info, zerofill_dob };
