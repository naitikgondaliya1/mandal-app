const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const member = db.member_detail;
const fs = require('fs');
const path = require('path');
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

const totalMemberDirecter = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const year = req.query.year;

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
    let whereCondition = {};
    if (year) {
      whereCondition = {
        created_date: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                "DATE_PART",
                "year",
                sequelize.cast(sequelize.col("created_date"), "date")
              ),
              year
            ),
          ],
        },
      };
    }

    let response = {};

    let kutumbCount = await mukhiya.count(whereCondition);
    response["kutumb"] = kutumbCount ? kutumbCount : 0;

    let memberCount = await member.count(whereCondition);
    response["member"] = memberCount ? memberCount : 0;

    let mukhiyaMaleCount = await mukhiya.count({
      where: { gender: "MALE", ...whereCondition },
    });
    let memberMaleCount = await member.count({
      where: { gender: "MALE", ...whereCondition },
    });

    let maleCount = mukhiyaMaleCount + memberMaleCount;
    response["male"] = maleCount ? maleCount : 0;

    let mukhiyaFeMaleCount = await mukhiya.count({
      where: { gender: "FEMALE", ...whereCondition },
    });
    let memberFeMaleCount = await member.count({
      where: { gender: "FEMALE", ...whereCondition },
    });

    let FeMaleCount = mukhiyaFeMaleCount + memberFeMaleCount;
    response["FeMale"] = FeMaleCount ? FeMaleCount : 0;

    let mukhiyaUnMarrage = await mukhiya.count({
      where: { marriage_status: "UNMARRIED", ...whereCondition },
    });
    let memberUnMarrage = await member.count({
      where: { marriage_status: "UNMARRIED", ...whereCondition },
    });
    let UnMarrageCount = mukhiyaUnMarrage + memberUnMarrage;
    response["unMarrage"] = UnMarrageCount ? UnMarrageCount : 0;

    let mukhiyaMarrage = await mukhiya.count({
      where: { marriage_status: "MARRIED", ...whereCondition },
    });
    let memberMarrage = await member.count({
      where: { marriage_status: "MARRIED", ...whereCondition },
    });
    let MarrageCount = mukhiyaMarrage + memberMarrage;
    response["Marrage"] = MarrageCount ? MarrageCount : 0;

    let mukhiyaMaleMarrage = await mukhiya.count({
      where: {
        marriage_status: "UNMARRIED",
        gender: "MALE",
        ...whereCondition,
      },
    });
    let memberMaleMarrage = await member.count({
      where: {
        marriage_status: "UNMARRIED",
        gender: "MALE",
        ...whereCondition,
      },
    });
    let MarrageMaleCount = memberMaleMarrage + mukhiyaMaleMarrage;
    response["UnMarrageMale"] = MarrageMaleCount ? MarrageMaleCount : 0;

    let mukhiyaMaleUnMarrage = await mukhiya.count({
      where: {
        marriage_status: "UNMARRIED",
        gender: "MALE",
        ...whereCondition,
      },
    });
    let memberMaleUnMarrage = await member.count({
      where: {
        marriage_status: "UNMARRIED",
        gender: "MALE",
        ...whereCondition,
      },
    });
    let MarrageMaleUnCount = memberMaleUnMarrage + mukhiyaMaleUnMarrage;
    response["unMarrageMale"] = MarrageMaleUnCount ? MarrageMaleUnCount : 0;

    let whereConditionr = ""; // Initialize the where condition string

    if (year) {
      // Add the year-based condition to the where clause
      whereConditionr = `WHERE EXTRACT(YEAR FROM mk.created_date) = ${year}`;
    }
    let village = await sequelize.query(`SELECT 
        COALESCE(md.village_name, mk.village_name) AS village,
        COUNT(DISTINCT md.member_id) AS member,
        COUNT(DISTINCT mk.mukhiya_id) AS kutumb
    FROM mukhiyas mk
    FULL OUTER JOIN member_details md ON mk.village_name = md.village_name
    ${whereConditionr}
    GROUP BY COALESCE(md.village_name, mk.village_name);
    `);

    response["villageCount"] = village[0] ? village[0] : [];
    return res.status(200).send({
      status: 1,
      msg: "fetch member director successfull",
      data: response,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const villageMember = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const village = req?.query?.village || null;
    const city = req?.query?.city || null;

    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

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

    let whereCondition = '';
    if (city) whereCondition = ` AND city_name = '${city}'`;

    let memberData = await sequelize.query(`SELECT * FROM member_details where village_name = '${village}' ${whereCondition}`);
    memberData = memberData[0] ? memberData[0] : [];
    return res.status(200).send({
      status: 1,
      msg: "fetch member by village successfull",
      data: memberData,
    });
  } catch (error) {
    console.log("==error===", error)
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const memberGet = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const member_id = req?.query?.member_id || null;

    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

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

    let whereCondition = '';

    let memberData = await sequelize.query(`SELECT * FROM member_details where member_id = '${member_id}'`);
    memberData = memberData[0] ? memberData[0] : [];
    return res.status(200).send({
      status: 1,
      msg: "fetch member by id successfull",
      data: memberData,
    });
  } catch (error) {
    console.log("==error===", error)
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const memberProfile = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const publicDirectoryPath = path.join(__dirname,'..', 'public');
    const filename = req.params.filename;
    const imagePath = path.join(publicDirectoryPath, 'member_profile_image', filename);

    if (!auth_token) {
      return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

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

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Determine the file extension
    const ext = path.extname(imagePath).toLowerCase();

    // Set the appropriate content type based on the file extension
    let contentType;
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else {
      res.status(400).send('Invalid file format');
      return;
    }

    // Read the file and send it in the response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.status(500).send('Internal server error');
      } else {
        res.set('Content-Type', contentType);
        res.send(data);
      }
    });
  } else {
    res.status(404).send('File not found');
  }
    // return res.status(200).send({
    //   status: 1,
    //   msg: "fetch member by id successfull",
    //   data: memberData,
    // });
  } catch (error) {
    console.log("==error===", error)
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { totalMemberDirecter, villageMember, memberGet, memberProfile };
