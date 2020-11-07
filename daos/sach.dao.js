const AWS = require("aws-sdk");
require("dotenv").config();

const BUCKET_NAME = "vinam-sach";

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "sach";

const getAllSach = async () => {
  const params = {
    TableName: table,
  };
  return await (await docClient.scan(params).promise()).Items;
};

const getSingleByID = async (ma_sach) => {
  const options = {
    TableName: table,
    Key: {
      ma_sach: ma_sach,
    },
  };
  return await (await docClient.get(options).promise()).Item;
};

const addSach = async (sach) => {
  const options = {
    TableName: table,
    Item: sach,
  };
  return await docClient
    .put(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const deleteSachByID = async (ma_sach) => {
  const options = {
    TableName: table,
    Key: {
      ma_sach: ma_sach,
    },
  };
  return await docClient
    .delete(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const update = async (sach) => {
  const options = {
    TableName: table,
    Key: {
      ma_sach: sach.ma_sach,
    },
    UpdateExpression:
      "set ten_sach = :name, namSanXuat=:namsx, hinhAnh=:hinhAnh, id_loaisach=:loaisach",
    ExpressionAttributeValues: {
      ":name": sach.ten_sach,
      ":namsx": sach.namSanXuat,
      ":hinhAnh": sach.hinhAnh,
      ":loaisach": sach.id_loaisach,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return await docClient
    .update(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const uploadHinhAnh = async (hinhAnh) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: hinhAnh.name, // File name you want to save as in S3
    Body: hinhAnh.data,
    ACL: "public-read",
  };
  return await (await s3.upload(params).promise()).Location;
};

module.exports = {
  getAllSach,
  addSach,
  getSingleByID,
  deleteSachByID,
  update,

  uploadHinhAnh,
};
