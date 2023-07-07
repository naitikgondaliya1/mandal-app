const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const member = db.member_detail;
const fs = require("fs");
const path = require("path");
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

const unMarriedMember = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    let village = req?.query?.village || null;
    let city = req?.query?.city || null;
    let gender = req?.query?.gender || null;
    let minAge = req?.query?.minAge || null;
    let maxAge = req?.query?.maxAge || null;
    let education = req?.query?.education || null;
    let marriage_status = req?.query?.marriage_status || null;

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

    let whereCondition = "";
    if (village) {
      whereCondition = ` AND village_name = '${village}'`;
    }

    if (city) {
      whereCondition += ` AND city_name = '${city}'`;
    }

    if (gender) {
      whereCondition += ` AND gender = '${gender}'`;
    }

    if (marriage_status) {
      whereCondition += ` AND marriage_status = '${marriage_status}'`;
    }

    if (minAge & maxAge) {
      whereCondition += ` AND EXTRACT(YEAR FROM age(current_date, birth_date)) BETWEEN ${minAge} AND ${maxAge}`;
    }

    if (education) {
      whereCondition += ` AND education = ${education}`;
    }
    const query = `SELECT * FROM member_details where marriage_status = 'UNMARRIED' ${whereCondition}`;
    let memberData = await sequelize.query(query);
    memberData = memberData[0] ? memberData[0] : [];
    return res.status(200).send({
      status: 1,
      msg: "fetch all unMarried",
      data: memberData,
    });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const allVillage = async (req, res) => {
  try {
    const query = `SELECT village_name FROM member_details GROUP BY village_name`;
    let village = await sequelize.query(query);
    village = village[0] ? village[0] : [];

    let city = await sequelize.query(
      `SELECT city_name FROM member_details GROUP By  city_name`
    );
    city = city[0] ? city[0] : [];
    return res.status(200).send({
      status: 1,
      msg: "fetch all village",
      data: {
        village,
        city,
      },
    });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const memberByBlood = async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    let blood = req?.query?.blood || null;

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

    const query = `SELECT * FROM member_details where blood_group = '${blood}'`;
    let memberData = await sequelize.query(query);
    memberData = memberData[0] ? memberData[0] : [];

    let mukhiyaBlood = await sequelize.query(
      `SELECT * FROM mukhiyas where blood_group = '${blood}'`
    );
    mukhiyaBlood = mukhiyaBlood[0] ? mukhiyaBlood[0] : [];

    const bloodData = [...memberData, ...mukhiyaBlood];
    return res.status(200).send({
      status: 1,
      msg: "fetch all member by blood",
      data: bloodData,
    });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getImage = async (req, res) => {
  try {
    const publicDirectoryPath = path.join(__dirname, "..", "public");
    const filename = req.query.filename;
    const imagePath = path.join(publicDirectoryPath, filename);

    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      // Determine the file extension
      const ext = path.extname(imagePath).toLowerCase();

      // Set the appropriate content type based on the file extension
      let contentType;
      if (ext === ".jpg" || ext === ".jpeg") {
        contentType = "image/jpeg";
      } else if (ext === ".png") {
        contentType = "image/png";
      } else {
        res.status(400).send("Invalid file format");
        return;
      }

      // Read the file and send it in the response
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          res.status(500).send("Internal server error");
        } else {
          res.set("Content-Type", contentType);
          res.send(data);
        }
      });
    } else {
      res.status(404).send("File not found");
    }
    // return res.status(200).send({
    //   status: 1,
    //   msg: "fetch member by id successfull",
    //   data: memberData,
    // });
  } catch (error) {
    console.log("==error===", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getMemberById = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const memeberId = req?.query?.memberId ||  null;
  if(!memeberId){
    return res.status(400).json({ error: "Provide member id Not found memberId" });
  }
  try {
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
 
    let memberDetails = await db.sequelize.query(
      ` select * from member_details where member_id =  '${memeberId}'`
    );
    memberDetails = memberDetails[0].length > 0 ? memberDetails[0] : null;
      if(!memberDetails){
        res.status(500).send(`No member found with this memberId ${memeberId}`);
      }
    res
      .status(200)
      .send({
        status: 1,
        msg: "member details fetch successFully",
        data: memberDetails[0] ? memberDetails[0] : null,
      });
  } catch (error) {
    console.log("======error=====", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { unMarriedMember, allVillage, memberByBlood, getImage, getMemberById };
