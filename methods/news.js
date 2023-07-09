const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const newsDb = db.news;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createNews = async (req, res) => {
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
        `./public/news/${req.file.filename}`,
        `./public/news/${file_name}`,
        (err) => {}
      );
    }
    const { news } = req.body;

    let newsData = await newsDb.create({
      photo: `news/${file_name}`,
      news: news ? news : null,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    res.status(200).send({ message: "news add succssfully", newsData });
  } catch (error) {
    console.log("====error====", error)
    res.status(500).send("Internal Server Error");
  }
};

const getNews = async (req, res) => {
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

    const query = ` select * from news ${whereCondition}`
    console.log("=====query=====", query)
    let newsData = await db.sequelize.query(
      query
    );
    newsData = newsData[0] ? newsData[0] : null;

    res.status(200).send({ message: "news fetch succssfully", newsData });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createNews, getNews };
