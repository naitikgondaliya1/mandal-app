require('dotenv').config();
const multer = require("multer");



//// profile pic upload on file middleware

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/slider_images')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension == "jpg" || extension == "jpeg" || extension == "png") {
            cb(null, file.originalname)
        } else {
            cb(null, "file formate not allow")
        }
    }
})

const upload = multer({ storage: storage })




const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/mukhiya_profile_image')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension == "jpg" || extension == "jpeg" || extension == "png") {
            cb(null, file.originalname)
        } else {
            cb(null, "file formate not allow")
        }
    }
})

const upload1 = multer({ storage: storage1 })


const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/member_profile_image')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension == "jpg" || extension == "jpeg" || extension == "png") {
            cb(null, file.originalname)
        } else {
            cb(null, "file formate not allow")
        }
    }
})

const upload2 = multer({ storage: storage2 })




module.exports = {
    upload,
    upload1,
    upload2
}