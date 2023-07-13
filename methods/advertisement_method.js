const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const advertisement = db.advertisement;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createAdvertisement = async (req, res) => {
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
        `./public/advertisement/${req.file.filename}`,
        `./public/advertisement/${file_name}`,
        (err) => {}
      );
    }
    const { business_name, owner_name, city, mobile_no , email,website,business_address } = req.body;

    let advertisementData = await advertisement.create({
      photo: `advertisement/${file_name}`,
      business_name: business_name ? business_name : null,
      owner_name: owner_name ? owner_name : null,
      city: city ? city : null,
      mobile_no: mobile_no ? mobile_no : null,
      email: email ? email : null,
      website: website ? website : null,
      business_address: business_address ? business_address : null,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    res.status(200).send({ message: "advertisement add succssfully", advertisementData });
  } catch (error) {
    console.log("====error====", error)
    res.status(500).send("Internal Server Error");
  }
};


const getadvertisement = async (req, res) => {
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

    const query = ` select * from advertisements ${whereCondition}`
    console.log("=====query=====", query)
    let advertisementData = await db.sequelize.query(
      query
    );
    advertisementData = advertisementData[0] ? advertisementData[0] : null;

    res.status(200).send({ message: "advertisement fetch succssfully", advertisementData });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

const removeAdvertisement = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const id =  req?.params?.advertisementId
  if (!id) {
    return res.status(404).send({ status: 0, msg: "require advertisementId at path" });
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
     
    let advertisementsData = await db.sequelize.query(
      ` select *  from advertisements where advertisement_id = ${id}`
    );

    if(advertisementsData[0].length <= 0) {
     return res.status(500).send({message:"Advertisement not found"});
    }

    const query = ` delete  from advertisements where advertisement_id = ${id}`
    await db.sequelize.query(
      query
    );

   return res.status(200).send({ message: `removeAdvertisement ${id} delete succssfully` });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createAdvertisement, getadvertisement, removeAdvertisement };
