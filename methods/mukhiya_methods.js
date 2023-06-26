const db = require("../utils/db_connection.js");
const admin = db.admin;
const admin_headline = db.admin_headline;
const mukhiya = db.mukhiya;
const slider = db.slider;
const member_detail = db.member_detail;
const bcrypt = require("bcryptjs");
const validation = require("../validation/validation.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const member = require("../models/member.js");
// const { response } = require("express");
// const { ifError } = require("assert");

// const mukhiyaLogin = async (req, res) => {
//     const mukhiyaDetails = req.body;

//     if (mukhiyaDetails) {

//         const response = validation.mukhiyaLogin(req.body)

//         try {

//             if (response.error) {
//                 return res.status(200).send({ status: 0, msg: response.error.message });
//             }
//             else {
//                 const data = response.value;

//                 const mukhiyaDetails = await mukhiya.findOne({
//                     where: {
//                         member_id: data.member_id,
//                     }
//                 })
//                 if (!mukhiyaDetails) {
//                     return res.status(404).json({ error: "User does not found" });
//                 }

//                 if (mukhiyaDetails.auth_token == null) {
//                     if (data.member_password == mukhiyaDetails.member_password) {
//                         var password = await bcrypt.hash(mukhiyaDetails.member_password, 10);

//                         const auth_token = jwt.sign(mukhiyaDetails.member_id, process.env.SECRET_KEY)

//                         await mukhiya.update({
//                             member_password: password,
//                             auth_token: auth_token
//                         }, {
//                             where: {
//                                 mukhiya_id: mukhiyaDetails.mukhiya_id,
//                             }
//                         })

//                     } else {
//                         return res.status(404).json({ error: "Invalide password" });
//                     }
//                 } else {
//                     var password = await bcrypt.compare(data.member_password, mukhiyaDetails.member_password);
//                     if (!password) {
//                         return res.status(404).json({ error: "Invalide password" });
//                     }
//                 }

//                 const mukhiyaData = await mukhiya.findOne({
//                     where: {
//                         mukhiya_id: mukhiyaDetails.mukhiya_id,
//                     },
//                     attributes: ["auth_token"]
//                 })

//                 res.status(200).send({ status: 1, msg: "login successfull", data: mukhiyaData });
//             }

//         } catch (error) {
//             res.status(500).send("Internal Server Error");
//         }
//     }
// }

const mukhiyaLogin = async (req, res) => {
    const mukhiyaDetails = req.body;
    if (mukhiyaDetails) {
        const response = validation.mukhiyaLogin(req.body);
        try {
            if (response.error) {
                return res.status(200).send({ status: 0, msg: response.error.message });
            } else {
                const data = response.value;
                let mukhiyaDetails = await mukhiya.findOne({
                    where: {
                        member_id: data.member_id,
                    },
                });
                mukhiyaDetails = mukhiyaDetails?.dataValues ? mukhiyaDetails?.dataValues : null

                if (!mukhiyaDetails) {
                    return res.status(404).json({ error: "User does not found" });
                }
                if (mukhiyaDetails.auth_token == null) {
                    if (data.member_password == mukhiyaDetails.member_password) {
                        var password = await bcrypt.hash(
                            mukhiyaDetails.member_password,
                            10
                        );
                        const auth_token = jwt.sign(
                            mukhiyaDetails.member_id,
                            process.env.SECRET_KEY
                        );
                        await mukhiya.update(
                            {
                                member_password: password,
                                auth_token: auth_token,
                            },
                            {
                                where: {
                                    mukhiya_id: mukhiyaDetails.mukhiya_id,
                                },
                            }
                        );
                    } else {
                        return res.status(404).json({ error: "Invalide password" });
                    }
                } else {
                    var password = await bcrypt.compare(
                        data.member_password,
                        mukhiyaDetails.member_password
                    );
                    if (!password) {
                        return res.status(404).json({ error: "Invalide password" });
                    }
                }
                let mukhiyaData = await mukhiya.findOne({
                    where: {
                        mukhiya_id: mukhiyaDetails.mukhiya_id,
                    },
                    attributes: ["auth_token"],
                });
                mukhiyaData = mukhiyaData?.dataValues ? mukhiyaData?.dataValues : null

                res
                    .status(200)
                    .send({ status: 1, msg: "login successfull", data: mukhiyaData });
            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
};

const mukhiyafatchHeadLine = async (req, res) => {
    const auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        let mukhiyaDetails = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            }
        });
        mukhiyaDetails = mukhiyaDetails?.dataValues ? mukhiyaDetails?.dataValues : null

        if (!mukhiyaDetails) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            let headLineData = await admin_headline.findAll({});
            headLineData = headLineData?.dataValues ? headLineData?.dataValues : null

            res
                .status(200)
                .send({ status: 1, msg: "head line detail", data: headLineData });
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

const editMukhiyaDetails = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    let mukhiyaDetail = await mukhiya.findOne({
        where: {
            auth_token: auth_token,
        },
    });
    mukhiyaDetail = mukhiyaDetail?.dataValues ? mukhiyaDetail?.dataValues : null


    if (!mukhiyaDetail) {
        return res.status(203).json({ error: "wrong authenticator" });
    }

    if (mukhiyaDetail) {
        const response = validation.editMukhiyaDetails(req.body);
        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        } else {
            const data = response.value;
            // console.log(mukhiyaDetail.business_adress);

            if (req.file) {
                const random = Math.floor(Math.random() * 10000000);
                const typeofextention = req.file.filename.slice(
                    (Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1
                );
                const mukhiya_id = mukhiyaDetail.mukhiya_id;
                var file_name = `${mukhiya_id}_${random}_${mukhiya_id}.${typeofextention}`;
                fs.rename(
                    `./public/mukhiya_profile_image/${req.file.filename}`,
                    `./public/mukhiya_profile_image/${file_name}`,
                    (err) => { }
                );
                fs.unlink(`.${mukhiyaDetail.mukhiya_profile_photo}`, (err) => { });
            }
            if (file_name) {
                var mukhiya_profile_photo = `/public/mukhiya_profile_image/${file_name}`;
            } else {
                var mukhiya_profile_photo = mukhiyaDetail.mukhiya_profile_photo;
            }

            if (data.mukhiya_name) {
                var mukhiya_name = data.mukhiya_name;
            } else {
                var mukhiya_name = mukhiyaDetail.mukhiya_name;
            }
            if (data.middle_name) {
                var middle_name = data.middle_name;
            } else {
                var middle_name = mukhiyaDetail.middle_name;
            }
            if (data.last_name) {
                var last_name = data.last_name;
            } else {
                var last_name = mukhiyaDetail.last_name;
            }
            if (data.birth_date) {
                var birth_date = data.birth_date;
            } else {
                var birth_date = mukhiyaDetail.birth_date;
            }
            if (data.country_name) {
                var country_name = data.country_name;
            } else {
                var country_name = mukhiyaDetail.country_name;
            }
            if (data.city_name) {
                var city_name = data.city_name;
            } else {
                var city_name = mukhiyaDetail.city_name;
            }
            if (data.village_name) {
                var village_name = data.village_name;
            } else {
                var village_name = mukhiyaDetail.village_name;
            }
            if (data.maternal_village_name) {
                var maternal_village_name = data.maternal_village_name;
            } else {
                var maternal_village_name = mukhiyaDetail.maternal_village_name;
            }
            if (data.blood_group) {
                var blood_group = data.blood_group;
            } else {
                var blood_group = mukhiyaDetail.blood_group;
            }
            if (data.cast) {
                var cast = data.cast;
            } else {
                var cast = mukhiyaDetail.cast;
            }
            if (data.marriage_status) {
                var marriage_status = data.marriage_status;
            } else {
                var marriage_status = mukhiyaDetail.marriage_status;
            }
            if (data.education) {
                var education = data.education;
            } else {
                var education = mukhiyaDetail.education;
            }
            if (data.bussiness) {
                var bussiness = data.bussiness;
            } else {
                var bussiness = mukhiyaDetail.bussiness;
            }
            if (data.social_media_link) {
                var social_media_link = data.social_media_link;
            } else {
                var social_media_link = mukhiyaDetail.social_media_link;
            }
            if (data.email) {
                var email = data.email;
            } else {
                var email = mukhiyaDetail.email;
            }
            if (data.adress) {
                var adress = data.adress;
            } else {
                var adress = mukhiyaDetail.adress;
            }
            if (data.business_adress) {
                var business_adress = data.business_adress;
            } else {
                var business_adress = mukhiyaDetail.business_adress;
            }

            const mukhiyadetail = await mukhiya.update(
                {
                    mukhiya_name: mukhiya_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    birth_date: birth_date,
                    country_name: country_name,
                    city_name: city_name,
                    village_name: village_name,
                    maternal_village_name: maternal_village_name,
                    blood_group: blood_group,
                    cast: cast,
                    marriage_status: marriage_status,
                    education: education,
                    bussiness: bussiness,
                    social_media_link: social_media_link,
                    email: email,
                    adress: adress,
                    business_adress: business_adress,
                    mukhiya_profile_photo: mukhiya_profile_photo,
                    updated_date: Date.now(),
                },
                {
                    where: {
                        auth_token: auth_token,
                    },
                }
            );

            const mukhiyadata = await mukhiya.findOne({
                where: {
                    auth_token: auth_token,
                },
            });

            res
                .status(200)
                .send({
                    status: 1,
                    msg: "edit mukhiya details successfull",
                    data: mukhiyadata,
                });
        }
    }
};

const changePassword = async (req, res) => {
    const auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

    let mukhiyaDetails = await mukhiya.findOne({
        where: {
            auth_token: auth_token,
        },
    });
    mukhiyaDetails = mukhiyaDetails?.dataValues ? mukhiyaDetails?.dataValues : null

    if (!mukhiyaDetails) {
        return res.status(203).json({ error: "wrong authenticator" });
    } else {
        const response = validation.changePassword(req.body);
        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        } else {
            const data = response.value;

            const old_password = await bcrypt.compare(
                data.old_password,
                mukhiyaDetails.member_password
            );
            if (old_password == false) {
                return res
                    .status(404)
                    .json({ error: "Please enter correct credentials" });
            } else {
                const new_password = await bcrypt.hash(data.new_password, 10);
                await mukhiya.update(
                    {
                        member_password: new_password,
                    },
                    {
                        where: {
                            auth_token: auth_token,
                        },
                    }
                );

                res.status(200).send({ status: 1, msg: "password change successfull" });
            }
        }
    }
};

const fatchMukhiyaProfile = async (req, res) => {
    const auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        let mukhiyaDetails = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            },
        });
        mukhiyaDetails = mukhiyaDetails?.dataValues ? mukhiyaDetails?.dataValues : null

        if (!mukhiyaDetails) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            res
                .status(200)
                .send({ status: 1, msg: "head line detail", data: mukhiyaDetails });
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

const addMembarDetails = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    let mukhiyaDetail = await mukhiya.findOne({
        where: {
            auth_token: auth_token,
        },
    });
    mukhiyaDetail = mukhiyaDetail?.dataValues ? mukhiyaDetail?.dataValues : null

    if (!mukhiyaDetail) {
        return res.status(203).json({ error: "wrong authenticator" });
    }

    if (mukhiyaDetail) {
        const response = validation.addMembarDetails(req.body);
        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        } else {
            const data = response.value;
            console.log(mukhiyaDetail.business_adress);
            let memberdetail = await member_detail.create({
                mukhiya_auth_token: mukhiyaDetail.auth_token,
                mukhiya_member_id: mukhiyaDetail.member_id,
                member_name: data.member_name,
                member_mobile_no: data.member_mobile_no,
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
                is_deleted: 0,
                created_date: Date.now(),
                updated_date: Date.now(),
            });
            memberdetail = memberdetail?.dataValues ? memberdetail?.dataValues : null

            if (req.file) {
                const random = Math.floor(Math.random() * 10000000);
                const typeofextention = req.file.filename.slice(
                    (Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1
                );
                const member_id = memberdetail.member_id;
                var file_name = `${member_id}_${random}_${member_id}.${typeofextention}`;
                fs.rename(
                    `./public/member_profile_image/${req.file.filename}`,
                    `./public/member_profile_image/${file_name}`,
                    (err) => { }
                );
            }

            const mukhiyadetail = await member_detail.update(
                {
                    member_profile_photo: `/public/member_profile_image/${file_name}`,
                    updated_date: Date.now(),
                },
                {
                    where: {
                        member_id: memberdetail.member_id,
                    },
                }
            );
            let memberData = await member_detail.findOne({
                where: {
                    member_id: memberdetail.member_id,
                },
            });
            memberData = memberData?.dataValues ? memberData?.dataValues : null

            res
                .status(200)
                .send({
                    status: 1,
                    msg: "add member details successfull",
                    data: memberData,
                });
        }
    }
};

const editMemberDetails = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers["auth-token"];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    let mukhiyaDetail = await mukhiya.findOne({
        where: {
            auth_token: auth_token,
        },
    });
    mukhiyaDetail = mukhiyaDetail?.dataValues ? mukhiyaDetail?.dataValues : null

    if (!mukhiyaDetail) {
        return res.status(203).json({ error: "wrong authenticator" });
    }

    if (mukhiyaDetail) {
        const response = validation.editMemberDetails(req.body);
        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        } else {
            const data = response.value;
            let memberDetail = await member_detail.findOne({
                where: {
                    member_id: data.member_id,
                },
            });
            memberDetail = memberDetail?.dataValues ? memberDetail?.dataValues : null
            if (!memberDetail) {
                return res.status(404).send({ status: 0, msg: "member not found" });
            } else {
                if (req.file) {
                    const random = Math.floor(Math.random() * 10000000);
                    const typeofextention = req.file.filename.slice(
                        (Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1
                    );
                    const member_id = memberDetail.member_id;
                    var file_name = `${member_id}_${random}_${member_id}.${typeofextention}`;
                    fs.rename(
                        `./public/member_profile_image/${req.file.filename}`,
                        `./public/member_profile_image/${file_name}`,
                        (err) => { }
                    );
                    fs.unlink(`.${memberDetail.member_profile_photo}`, (err) => { });
                }
                if (file_name) {
                    var member_profile_photo = `/public/member_profile_image/${file_name}`;
                } else {
                    var member_profile_photo = memberDetail.member_profile_photo;
                }
                if (data.member_mobile_no) {
                    var member_mobile_no = data.member_mobile_no;
                } else {
                    var member_mobile_no = memberDetail.member_mobile_no;
                }
                if (data.member_name) {
                    var member_name = data.member_name;
                } else {
                    var member_name = memberDetail.member_name;
                }
                if (data.middle_name) {
                    var middle_name = data.middle_name;
                } else {
                    var middle_name = memberDetail.middle_name;
                }
                if (data.last_name) {
                    var last_name = data.last_name;
                } else {
                    var last_name = memberDetail.last_name;
                }
                if (data.birth_date) {
                    var birth_date = data.birth_date;
                } else {
                    var birth_date = memberDetail.birth_date;
                }
                if (data.country_name) {
                    var country_name = data.country_name;
                } else {
                    var country_name = memberDetail.country_name;
                }
                if (data.city_name) {
                    var city_name = data.city_name;
                } else {
                    var city_name = memberDetail.city_name;
                }
                if (data.village_name) {
                    var village_name = data.village_name;
                } else {
                    var village_name = memberDetail.village_name;
                }
                if (data.maternal_village_name) {
                    var maternal_village_name = data.maternal_village_name;
                } else {
                    var maternal_village_name = memberDetail.maternal_village_name;
                }
                if (data.blood_group) {
                    var blood_group = data.blood_group;
                } else {
                    var blood_group = memberDetail.blood_group;
                }
                if (data.cast) {
                    var cast = data.cast;
                } else {
                    var cast = memberDetail.cast;
                }
                if (data.marriage_status) {
                    var marriage_status = data.marriage_status;
                } else {
                    var marriage_status = memberDetail.marriage_status;
                }
                if (data.education) {
                    var education = data.education;
                } else {
                    var education = memberDetail.education;
                }
                if (data.bussiness) {
                    var bussiness = data.bussiness;
                } else {
                    var bussiness = memberDetail.bussiness;
                }
                if (data.social_media_link) {
                    var social_media_link = data.social_media_link;
                } else {
                    var social_media_link = memberDetail.social_media_link;
                }
                if (data.email) {
                    var email = data.email;
                } else {
                    var email = memberDetail.email;
                }
                if (data.adress) {
                    var adress = data.adress;
                } else {
                    var adress = memberDetail.adress;
                }
                if (data.business_adress) {
                    var business_adress = data.business_adress;
                } else {
                    var business_adress = memberDetail.business_adress;
                }

                const mukhiyadetail = await member_detail.update(
                    {
                        member_mobile_no: member_mobile_no,
                        member_name: member_name,
                        middle_name: middle_name,
                        last_name: last_name,
                        birth_date: birth_date,
                        country_name: country_name,
                        city_name: city_name,
                        village_name: village_name,
                        maternal_village_name: maternal_village_name,
                        blood_group: blood_group,
                        cast: cast,
                        marriage_status: marriage_status,
                        education: education,
                        bussiness: bussiness,
                        social_media_link: social_media_link,
                        email: email,
                        adress: adress,
                        business_adress: business_adress,
                        member_profile_photo: member_profile_photo,
                        updated_date: Date.now(),
                    },
                    {
                        where: {
                            member_id: data.member_id,
                        },
                    }
                );

                let memberData = await member_detail.findOne({
                    where: {
                        member_id: data.member_id,
                    },
                });
                memberData = memberData?.dataValues ? memberData?.dataValues : null
                res
                    .status(200)
                    .send({
                        status: 1,
                        msg: "edit member details successfull",
                        data: memberData,
                    });
            }
        }
    }
};

const removeMemberById = async (req, res) => {
    const auth_token = req.headers["auth-token"];
    const member_id = req.params.id;
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        let mukhiyaDetail = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            },
        });
        mukhiyaDetail = mukhiyaDetail?.dataValues ? mukhiyaDetail?.dataValues : null

        if (!mukhiyaDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            let memberDetail = await member_detail.findOne({
                where: {
                    member_id: member_id,
                },
            });
            memberDetail = memberDetail?.dataValues ? memberDetail?.dataValues : null
            if (!memberDetail) {
                return res.status(404).json({ error: "please enter valid member id" });
            } else {
                const remove_member = await member_detail.destroy({
                    where: {
                        member_id: memberDetail.member_id,
                    },
                });

                if (remove_member) {
                    res
                        .status(200)
                        .send({ status: 1, msg: "member remove successfully" });
                } else {
                    res.status(400).send({ status: 1, msg: "member not remove" });
                }
            }
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

const mukhiyafatchAllSliderImages = async (req, res) => {
    const auth_token = req.headers["auth-token"];
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        let adminDetail = await mukhiya.findOne({
            where: {
                auth_token: auth_token,
            },
        });
        adminDetail = adminDetail?.dataValues ? adminDetail?.dataValues : null
        if (!adminDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            let sliderImageData = await slider.findAll({});
            sliderImageData = sliderImageData?.dataValues ? sliderImageData?.dataValues : null

            res
                .status(200)
                .send(sliderImageData);
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    mukhiyaLogin,
    mukhiyafatchHeadLine,
    editMukhiyaDetails,
    changePassword,
    fatchMukhiyaProfile,
    addMembarDetails,
    editMemberDetails,
    removeMemberById,
    mukhiyafatchAllSliderImages,
};
