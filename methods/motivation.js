const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const motivationDb = db.motivations;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createMotivation = async (req, res) => {
  const auth_token = req.headers["auth-token"];
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
    if (req.file) {
      const random = Math.floor(Math.random() * 10000000);
      const typeofextention = req.file.filename.slice(
        (Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1
      );
      var file_name = `${random}${Date.now()}.${typeofextention}`;
      fs.rename(
        `./public/motivation/${req.file.filename}`,
        `./public/motivation/${file_name}`,
        (err) => {}
      );
    }
    const { notes,motivation_By } = req.body;

    let motivationData = await motivationDb.create({
      photo: `motivation/${file_name}`,
      notes: notes ? notes : null,
      motivation_By: motivation_By? motivation_By: null,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    res.status(200).send({ message: "motivation add succssfully", motivationData });
  } catch (error) {
    console.log("====error====", error)
    res.status(500).send("Internal Server Error");
  }
};

const getMotivation = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const year = req?.query?.year || null
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

    let whereCondition = ''

    if (year) {
      whereCondition =  `where EXTRACT(YEAR FROM created_date) =  ${year}`
   }

    const query = ` select * from motivations ${whereCondition}`
    let motivationData = await db.sequelize.query(
      query
    );
    motivationData = motivationData[0] ? motivationData[0] : null;

    res.status(200).send({ message: "motivation fetch succssfully", motivationData });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createMotivation, getMotivation };
