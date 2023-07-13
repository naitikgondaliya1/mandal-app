const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const business = db.business;
const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createBusiness = async (req, res) => {
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
        `./public/business/${req.file.filename}`,
        `./public/business/${file_name}`,
        (err) => {}
      );
    }
    const {
      business_name,
      owner_name,
      city,
      mobile_no,
      email,
      website,
      business_address,
    } = req.body;

    let businessData = await business.create({
      photo: `business/${file_name}`,
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

    res.status(200).send({ message: "business add succssfully", businessData });
  } catch (error) {
    console.log("====error====", error);
    res.status(500).send("Internal Server Error");
  }
};

const getBusiness = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const year = req?.query?.year || null;
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

    let whereCondition = "";

    if (year) {
      whereCondition = `where EXTRACT(YEAR FROM created_date) =  ${year}`;
    }

    const query = ` select * from businesses ${whereCondition}`;
    let businessData = await db.sequelize.query(query);
    businessData = businessData[0] ? businessData[0] : null;

    res
      .status(200)
      .send({ message: "business fetch succssfully", businessData });
  } catch (error) {
    console.log("=====error=====", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateBusiness = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const businessId = req?.params?.businessId || null;
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

    const {
      business_name,
      owner_name,
      city,
      mobile_no,
      email,
      website,
      business_address,
    } = req.body;

    let updateObject = {};
    if (business_name) updateObject.business_name = business_name;
    if (owner_name) updateObject.owner_name = owner_name;
    if (city) updateObject.city = city;
    if (mobile_no) updateObject.mobile_no = mobile_no;
    if (email) updateObject.email = email;
    if (business_address) updateObject.business_address = business_address;
    if (website) updateObject.website = website;
    const businessData = await business.update(updateObject, {
      where: {
        business_id: businessId
      },
    });

    res
      .status(200)
      .send({ message: "business update succssfully"});
  } catch (error) {
    console.log("=====error=====", error);
    res.status(500).send("Internal Server Error");
  }
};
const removeBusiness = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const id =  req?.params?.businessId
  if (!id) {
    return res.status(404).send({ status: 0, msg: "require businessId at path" });
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

    let businessesData = await db.sequelize.query(
      ` select *  from businesses where business_id = ${id}`
    );

    if(businessesData[0].length <= 0) {
     return res.status(500).send({message:"business not found"});
    }

    const query = ` delete  from businesses where business_id = ${id}`
    await db.sequelize.query(
      query
    );

   return res.status(200).send({ message: `business ${id} delete succssfully` });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createBusiness, getBusiness, updateBusiness , removeBusiness};
