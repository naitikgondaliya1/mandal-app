const joi = require("joi")



function adminLogin(admin) {
    const adminDetails =
        joi.object({
            mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return adminDetails.validate(admin)
}

function editHeadLine(headlines) {
    const headLine =
        joi.object({
            headline: joi.string()
                .trim()
                .min(1)
                .required()
        })


    return headLine.validate(headlines)
}

function creatMember(memberData) {
    const memberDetails =
        joi.object({
            mukhiya_mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            member_id: joi.string()
                .trim()
                .min(8)
                .required(),
            password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return memberDetails.validate(memberData)
}

function mukhiyaLogin(mukhiya) {
    const mukhiyaDetails =
        joi.object({
            member_id: joi.string()
                .trim()
                .min(8)
                .required(),
            member_password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return mukhiyaDetails.validate(mukhiya)
}


function editMember(memberData) {
    const memberDetails =
        joi.object({
            mukhiya_mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1),
            member_password: joi.string()
                .trim()
                .min(6)

        })

    return memberDetails.validate(memberData)
}

function editMukhiyaDetails(memberData) {
    const memberDetails =
        joi.object({
            mukhiya_name: joi.string()
                .trim()
                .min(1)
                .required(),
            middle_name: joi.string()
                .trim()
                .min(1)
                .required(),
            last_name: joi.string()
                .trim()
                .min(1)
                .required(),
            birth_date: joi.date()
                .raw()
                .required(),
            country_name: joi.string()
                .trim()
                .min(1)
                .required(),
            city_name: joi.string()
                .trim()
                .min(1)
                .required(),
            village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            maternal_village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            blood_group: joi.string()
                .trim()
                .min(1)
                .required(),
            cast: joi.string()
                .trim()
                .min(1)
                .required(),
            marriage_status: joi.string()
                .trim()
                .min(1)
                .required(),
            education: joi.string()
                .trim()
                .min(1)
                .required(),
            bussiness: joi.string()
                .trim()
                .min(0),
            social_media_link: joi.string()
                .trim()
                .min(0),
            email: joi.string()
                .email()
                .required(),
            adress: joi.string()
                .trim()
                .min(1)
                .required(),
            business_adress: joi.string()
                .trim()
                .min(0)
        })

    return memberDetails.validate(memberData)
}


function changePassword(memberData) {
    const memberDetails =
        joi.object({
            old_password: joi.string()
                .trim()
                .min(6)
                .required(),
            new_password: joi.string()
                .trim()
                .min(6)
                .required(),

        })

    return memberDetails.validate(memberData)
}


function addMembarDetails(memberData) {
    const memberDetails =
        joi.object({
            member_mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1),
            member_name: joi.string()
                .trim()
                .min(1)
                .required(),
            middle_name: joi.string()
                .trim()
                .min(1)
                .required(),
            last_name: joi.string()
                .trim()
                .min(1)
                .required(),
            birth_date: joi.date()
                .raw()
                .required(),
            country_name: joi.string()
                .trim()
                .min(1)
                .required(),
            city_name: joi.string()
                .trim()
                .min(1)
                .required(),
            village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            maternal_village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            blood_group: joi.string()
                .trim()
                .min(1)
                .required(),
            cast: joi.string()
                .trim()
                .min(1)
                .required(),
            marriage_status: joi.string()
                .trim()
                .min(1)
                .required(),
            education: joi.string()
                .trim()
                .min(1)
                .required(),
            bussiness: joi.string()
                .trim()
                .min(0),
            social_media_link: joi.string()
                .trim()
                .min(0),
            email: joi.string()
                .email()
                .required(),
            adress: joi.string()
                .trim()
                .min(1)
                .required(),
            business_adress: joi.string()
                .trim()
                .min(0)
        })

    return memberDetails.validate(memberData)
}

function editMemberDetails(memberData) {
    const memberDetails =
        joi.object({
            member_id: joi.number()
                .integer()
                .min(1)
                .required(),
            member_mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1),
            member_name: joi.string()
                .trim()
                .min(1)
                .required(),
            middle_name: joi.string()
                .trim()
                .min(1)
                .required(),
            last_name: joi.string()
                .trim()
                .min(1)
                .required(),
            birth_date: joi.date()
                .raw()
                .required(),
            country_name: joi.string()
                .trim()
                .min(1)
                .required(),
            city_name: joi.string()
                .trim()
                .min(1)
                .required(),
            village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            maternal_village_name: joi.string()
                .trim()
                .min(1)
                .required(),
            blood_group: joi.string()
                .trim()
                .min(1)
                .required(),
            cast: joi.string()
                .trim()
                .min(1)
                .required(),
            marriage_status: joi.string()
                .trim()
                .min(1)
                .required(),
            education: joi.string()
                .trim()
                .min(1)
                .required(),
            bussiness: joi.string()
                .trim()
                .min(0),
            social_media_link: joi.string()
                .trim()
                .min(0),
            email: joi.string()
                .email()
                .required(),
            adress: joi.string()
                .trim()
                .min(1)
                .required(),
            business_adress: joi.string()
                .trim()
                .min(0)
        })

    return memberDetails.validate(memberData)
}

module.exports = {
    adminLogin,
    editHeadLine,
    creatMember,
    mukhiyaLogin,
    editMember,
    editMukhiyaDetails,
    changePassword,
    addMembarDetails,
    editMemberDetails,
}