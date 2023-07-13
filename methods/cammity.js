const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya
const cammity_member = db.cammity_member;
const jwt = require("jsonwebtoken");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const addCommityMember = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const { name, userId, type } = req.body;

    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

    let adminDetail = await admin.findOne({
      where: {
        auth_token: auth_token,
      },
    });

    adminDetail = adminDetail?.dataValues ? adminDetail?.dataValues : null;

    if (!adminDetail) {
      return res.status(203).json({ error: "wrong authenticator" });
    }

    console.log("======>>>", name, userId, type);

    let memberdetail = await cammity_member.create({
      name: name ? name : null,
      user_id: userId,
      type: type ? type : null,
      is_deleted: 0,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    return res.status(200).send({
      status: 1,
      msg: "fetch all unMarried",
      data: memberdetail,
    });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getCommityMember = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const year = req?.query?.year || null;

    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

    let adminDetail = await admin.findOne({
      where: {
        auth_token: auth_token,
      },
    });
    const tokenData = verifyJwt(auth_token);


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
       whereCondition =  `where EXTRACT(YEAR FROM MM.created_date) =  ${year}`
    }

    let memberData = await sequelize.query(`SELECT MM.MUKHIYA_ID AS MUKHIYAID,
	        MM.MUKHIYA_PROFILE_PHOTO,
	        MM.MIDDLE_NAME,
	        MM.LAST_NAME,
	        CM.TYPE,
	        MM.created_date
            FROM CAMMITY_MEMBERS CM
            LEFT JOIN MUKHIYAS MM ON CM.USER_ID = MM.MUKHIYA_ID ${whereCondition}`);

    return res.status(200).send({
      status: 1,
      msg: "fetch all unMarried",
      data: memberData[0],
    });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const removeCammityMember = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const id =  req?.params?.cammitymemberId
  if (!id) {
    return res.status(404).send({ status: 0, msg: "require cammitymemberId at path" });
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

    let commitymemberData = await db.sequelize.query(
      ` select *  from CAMMITY_MEMBERS where id = ${id}`
    );

    if(commitymemberData[0].length <= 0) {
     return res.status(500).send({message:"CAMMITY_MEMBERS not found"});
    }

    const query = ` delete  from CAMMITY_MEMBERS where id = ${id}`
    await db.sequelize.query(
      query
    );

   return res.status(200).send({ message: `cammity member ${id} delete succssfully` });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { addCommityMember , getCommityMember, removeCammityMember };
