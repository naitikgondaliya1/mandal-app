const db = require("../utils/db_connection.js");
const admin = db.admin;
const admin_headline = db.admin_headline;
const mukhiya = db.mukhiya;
const slider = db.slider;
const bcrypt = require("bcryptjs");
const validation = require("../validation/validation.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const fs = require("fs");
const { response } = require("express");
const { ifError } = require("assert");





const mukhiyaLogin = async (req, res) => {
    const mukhiyaDetails = req.body;

    if (mukhiyaDetails) {

        const response = validation.mukhiyaLogin(req.body)

        try {

            if (response.error) {
                return res.status(200).send({ status: 0, msg: response.error.message });
            }
            else {
                const data = response.value;

                const mukhiyaDetails = await mukhiya.findOne({
                    where: {
                        member_id: data.member_id,
                    }
                })
                if (!mukhiyaDetails) {
                    return res.status(404).json({ error: "User does not found" });
                }

                if (data.member_password != mukhiyaDetails.member_password) {
                    return res.status(404).json({ error: "Invalide password" });
                }
                const password = await bcrypt.hash(mukhiyaDetails.member_password, 10);

                const auth_token = jwt.sign(mukhiyaDetails.mukhiya_id, process.env.SECRET_KEY)

                await mukhiya.update({
                    member_password: password,
                    auth_token: auth_token
                }, {
                    where: {
                        mukhiya_id: mukhiyaDetails.mukhiya_id,
                    }
                })

                const mukhiyaData = await mukhiya.findOne({
                    where: {
                        mukhiya_id: mukhiyaDetails.mukhiya_id,
                    },
                    attributes: ["auth_token"]
                })


                res.status(200).send({ status: 1, msg: "login successfull", data: mukhiyaData });

            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
}

const fatchHeadLine = async (req, res) => {
    const auth_token = req.headers['auth-token'];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        const mukhiyaDetails = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!mukhiyaDetails) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            const headLineData = await admin_headline.findAll({})
            res.status(200).send({ status: 1, msg: "head line detail", data: headLineData });
        }



    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const editMukhiyaDetails = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers['auth-token'];


    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    const mukhiyaDetail = await admin.findOne({
        where: {
            auth_token: auth_token,
        }
    })
    if (!mukhiyaDetail) {
        return res.status(203).json({ error: "wrong authenticator" });
    }


    if (mukhiyaDetail) {

        const response = validation.editMukhiyaDetails(req.body)



        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        }
        else {

            const data = response.value;

            const mukhiyadetail = await mukhiya.update({
                mukhiya_name: data.mukhiya_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                birth_date: data.birth_date,
                country_name: data.country_name,
                city_name: data.city_name,
                village_name: data.village_name,
                maternal_village_name: data.maternal_village_name,
                blood_group: data.blood_group,
                cast: data.cast,
                marriage_status: data.marriage_status,
                education: data.education,
                bussiness: data.bussiness,
                social_media_link: data.social_media_link,
                email: data.email,
                adress: data.adress,
                business_adress: data.business_adress,
                updated_date: Date.now()
            }, {
                where: {
                    auth_token: auth_token,
                }
            })

            const mukhiyadata = await mukhiya.findOne({
                where: {
                    auth_token: auth_token,
                }
            })


            res.status(200).send({ status: 1, msg: "edit mukhiya details successfull", data: mukhiyadata });

        }

    }
}

const changePassword = async (req, res) => {
    const auth_token = req.headers['auth-token'];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

    const mukhiyaDetails = await mukhiya.findOne({
        where: {
            auth_token: auth_token,
        }
    })
    if (!mukhiyaDetails) {
        return res.status(203).json({ error: "wrong authenticator" });
    } else {
        const response = validation.changePassword(req.body)
        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        }
        else {
            const data = response.value;


            const old_password = await bcrypt.compare(data.old_password, mukhiyaDetails.member_password);
            if (old_password == false) {
                return res.status(404).json({ error: "Please enter correct credentials" });
            } else {
                const new_password = await bcrypt.hash(data.new_password, 10);
                await mukhiya.update({
                    member_password: new_password
                }, {
                    where: {
                        auth_token: auth_token,
                    }
                })

                res.status(200).send({ status: 1, msg: "password change successfull" });
            }
        }
    }


}

const fatchMukhiyaProfile = async (req, res) => {
    const auth_token = req.headers['auth-token'];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        const mukhiyaDetails = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!mukhiyaDetails) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            res.status(200).send({ status: 1, msg: "head line detail", data: mukhiyaDetails });
        }



    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {
    mukhiyaLogin,
    fatchHeadLine,
    editMukhiyaDetails,
    changePassword,
    fatchMukhiyaProfile

}