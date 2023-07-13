const db = require("../utils/db_connection.js");
require("dotenv").config();
const admin = db.admin;
const mukhiya = db.mukhiya;
const event = db.event;
const fs = require("fs");
const jwt = require("jsonwebtoken");


const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

const createEvent = async (req, res) => {
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
        `./public/event/${req.file.filename}`,
        `./public/event/${file_name}`,
        (err) => {}
      );
    }

    let memberdetail = await event.create({
      profile_photo: `event/${file_name}`,
      notes: notes ? notes : null,
      year: year ? year : null,
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    res.status(200).send(memberdetail);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updloadPhoto = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const { eventId } = req?.body;
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
        `./public/event/${req.file.filename}`,
        `./public/event/${file_name}`,
        (err) => {}
      );
    }

    let memberdetail = await event.findOne({ where: { event_id: eventId } });
    if(!memberdetail){
      res.status(400).send("event not found");

    }
    let photo = JSON.parse(memberdetail?.photo);
    photo.push(`event/${file_name}`);
    await event.update(
      {
        photo: JSON.stringify(photo),
      },
      {
        where: {
          event_id: eventId,
        },
      }
    );
    res.status(200).send({ message: "photo add in event successfully" });
  } catch (error) {
    console.log("====error====", error);
    res.status(500).send("Internal Server Error");
  }
};

const getEvent = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  if (!auth_token) {
    return res.status(404).send({ status: 0, msg: "auth token not found" });
  }
  try {
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

    let eventData = await event.findAll({raw:true});

    res.status(200).send({event: eventData});
  } catch (error) {
    console.log("=========", error)
    res.status(500).send("Internal Server Error");
  }
};

const removeEvent = async (req, res) => {
  const auth_token = req.headers["auth-token"];
  const id =  req?.params?.eventId
  if (!id) {
    return res.status(404).send({ status: 0, msg: "require eventId at path" });
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

    let eventData = await db.sequelize.query(
      ` select *  from events where event_id = ${id}`
    );

    if(eventData[0].length <= 0) {
     return res.status(500).send({message:"events not found"});
    }

    const query = ` delete  from events where event_id = ${id}`
    await db.sequelize.query(
      query
    );

   return res.status(200).send({ message: `event ${id} delete succssfully` });
  } catch (error) {
    console.log("=====error=====", error)
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createEvent, updloadPhoto, getEvent, removeEvent };
