var express = require("express");
var router = express.Router();

const sachDAO = require("../daos/sach.dao");

router.post("/sachs/hinhAnh", async (req, res) => {
  let files = req.files;
  let hinhAnh = await files.hinhAnh;
  const uploadS3 = await sachDAO.uploadHinhAnh(hinhAnh);
  res.send(uploadS3);
});

module.exports = router;