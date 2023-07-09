const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const suchna = db.suchna;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createSuchna = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const { notes, year } = req.body;
  if (!auth_token) {
    return res.status(404).send({ status: 0, msg: "auth token not found" });
  }
  try {
    let adminDetail = await admin.findOne({
      where: {
        auth_token: auth_token,
      },
    });
    adminDetail = adminDetail?.dataValues ? adminDetail?.dataValues : null;

    if (!adminDetail) {
      return res.status(203).json({ error: "wrong authenticator" });
    }

    if (req.file) {
      const random = Math.floor(Math.random() * 10000000);
      const typeofextention = req.file.filename.slice(
        (Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1
      );
      var file_name = `${random}${Date.now()}.${typeofextention}`;
      fs.rename(
        `./public/suchna/${req.file.filename}`,
        `./public/suchna/${file_name}`,
        (err) => {}
      );
    }

    let suchnadetail = await suchna.create({
      photo: `event/${file_name}`,
      notes: notes ? notes : null,
      year: year ? year : null,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    res.status(200).send({ message: "suchna add succssfully", suchnadetail });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getSuchna = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const { notes, year } = req.body;
  if (!auth_token) {
    return res.status(404).send({ status: 0, msg: "auth token not found" });
  }
  try {
    const tokenData = verifyJwt(auth_token);
    let adminDetail = await admin.findOne({
      where: {
        auth_token: auth_token,
      },
    });

    let mukhiyaDetails = await mukhiya.findOne({
      where: {
        member_id: tokenData,
      },
    });
    adminDetail = adminDetail?.dataValues ? adminDetail?.dataValues : null;
    mukhiyaDetails = mukhiyaDetails?.dataValues
      ? mukhiyaDetails?.dataValues
      : null;

    let verifyUser = adminDetail ? adminDetail : mukhiyaDetails;
    if (!verifyUser) {
      return res.status(203).json({ error: "wrong authenticator" });
    }

    const query = ` select * from suchnas`
    console.log("=====query=====", query)
    let suchnadetail = await db.sequelize.query(
      query
    );
    suchnadetail = suchnadetail[0] ? suchnadetail[0] : null


    res.status(200).send({ message: "suchna add succssfully", suchnadetail });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const deleteSuchna = async (req, res) => {
    const auth_token = req.headers["auth-token"];
    const suchnaId = req?.params?.suchnaId
    if(!suchnaId){
        return res.status(404).send({ status: 0, msg: "Provide suchna Id" });

    }
    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
      const tokenData = verifyJwt(auth_token);
      let adminDetail = await admin.findOne({
        where: {
          auth_token: auth_token,
        },
      });
  
      let mukhiyaDetails = await mukhiya.findOne({
        where: {
          member_id: tokenData,
        },
      });
      adminDetail = adminDetail?.dataValues ? adminDetail?.dataValues : null;
      mukhiyaDetails = mukhiyaDetails?.dataValues
        ? mukhiyaDetails?.dataValues
        : null;
  
      let verifyUser = adminDetail ? adminDetail : mukhiyaDetails;
      if (!verifyUser) {
        return res.status(203).json({ error: "wrong authenticator" });
      }
  
      const query = ` delete from suchnas where "suchna_id" = '${suchnaId}'`
      let suchnadetail = await db.sequelize.query(
        query
      );
      suchnadetail = suchnadetail[0] ? suchnadetail[0] : null
  
  
      res.status(200).send({ message: "suchna delete succssfully" });
    } catch (error) {
        console.log("====error====", error)
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = { createSuchna, getSuchna, deleteSuchna };
