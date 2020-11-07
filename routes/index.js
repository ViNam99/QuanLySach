var express = require("express");
var router = express.Router();
const uuid = require("node-uuid");

const loaisachDAO = require("../daos/loaisach.dao");
const sachDao = require("../daos/sach.dao");
const sachDAO = require("../daos/sach.dao");

/* GET home page. */
router.get("/", async (req, res) => {
  const loaisachs = await loaisachDAO.getAllLoaiSach();
  const sachs = await sachDAO.getAllSach();
  res.render("index", { sachs: sachs, loaisachs: loaisachs });
});

router.post("/sachs/add", async (req, res) => {
  const { ma_sach, ten_sach, namSanXuat, id_loaisach } = req.body;
  let files = req.files;
  let hinhAnh = await files.hinhAnh;
  const uploadS3 = await sachDAO.uploadHinhAnh(hinhAnh);

  const sach = {
    id: uuid.v1(),
    ma_sach,
    ten_sach,
    hinhAnh: uploadS3,
    namSanXuat,
    id_loaisach,
  };

  const success = await sachDAO.addSach(sach);
  if (success) {
    res.redirect("/");
  } else {
    res.status(400).send("Invalid");
  }
});

router.post("/loaisachs/add", async (req, res) => {
  const { ma_loaisach, ten_loaisach } = req.body;

  const loaisach = {
    id: uuid.v1(),
    ma_loaisach,
    ten_loaisach,
  };

  const success = await loaisachDAO.addLoaiSach(loaisach);
  if (success) {
    res.redirect("/");
  } else {
    res.status(400).send("Invalid");
  }
});

router.get("/sachs/delete/:id", async (req, res) => {
  const ma_sach = req.params.id;
  const success = await sachDAO.deleteSachByID(ma_sach);

  if (success) {
    res.redirect("/");
  } else {
    res.status(500).send(err);
  }
});

router.get("/loaisachs/delete/:id", async (req, res) => {
  const ma_loaisach = req.params.id;
  const success = await loaisachDAO.deleteLoaiSachByID(ma_loaisach);

  if (success) {
    res.redirect("/");
  } else {
    res.status(500).send(err);
  }
});

router.get("/loaisachs/update/form/:id", async (req, res) => {
  const ma_loaisach = req.params.id;
  const loaisach = await loaisachDAO.getSingleByID(ma_loaisach);
  res.render("LoaiSachFormUpdate", {
    loaiSachItem: loaisach,
  });
});

router.post("/loaisachs/update/:id", async (req, res) => {
  const loaisach = {
    ma_loaisach: req.params.id,
    ten_loaisach: req.body.ten_loaisach,
  };

  const success = await loaisachDAO.update(loaisach);
  if (success) {
    res.redirect("/");
  } else {
    res.status(400).send("Invalid");
  }
});

router.get("/sachs/update/form/:id", async (req, res) => {
  const ma_sach = req.params.id;
  const sach = await sachDAO.getSingleByID(ma_sach);
  const loaisachs = await loaisachDAO.getAllLoaiSach();

  res.render("SachFormUpdate", {
    sach,
    loaisachs,
  });
});

router.post('/sachs/update/:id', async (req, res) => {
  const {ten_sach, namSanXuat, id_loaisach } = req.body;

  let files = req.files;
  let hinhAnh = await files.hinhAnh;
  const uploadS3 = await sachDAO.uploadHinhAnh(hinhAnh);
  
  const sach = {
    ma_sach: req.params.id,
    ten_sach,
    hinhAnh: uploadS3,
    namSanXuat,
    id_loaisach,
  }
  const success = await sachDAO.update(sach);
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
})

module.exports = router;
