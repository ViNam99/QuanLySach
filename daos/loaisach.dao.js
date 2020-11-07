const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "loaisach";

const getAllLoaiSach = async () => {
  const params = {
    TableName: table,
  };
  return await (await docClient.scan(params).promise()).Items;
};

const getSingleByID = async (ma_loaisach) => {
  const options = {
    TableName: table,
    Key: {
      ma_loaisach: ma_loaisach,
    },
  };
  return await (await docClient.get(options).promise()).Item;
};

const addLoaiSach = async (loaisach) => {
  const options = {
    TableName: table,
    Item: loaisach,
  };
  return await docClient
    .put(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const deleteLoaiSachByID = async (ma_loaisach) => {
  const options = {
    TableName: table,
    Key: {
      ma_loaisach: ma_loaisach,
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

const update = async (loaisach) => {
  const options = {
    TableName: table,
    Key: {
      ma_loaisach: loaisach.ma_loaisach,
    },
    UpdateExpression: "set ten_loaisach = :name",
    ExpressionAttributeValues: {
      ":name": loaisach.ten_loaisach,
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

module.exports = {
  getAllLoaiSach,
  addLoaiSach,
  deleteLoaiSachByID,
  update,

  getSingleByID,
};
