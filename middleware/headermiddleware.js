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

const storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/event')
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

const upload3 = multer({ storage: storage3 })


const suchna = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/suchna')
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

const suchnaPhoto = multer({ storage: suchna })

const advertisement = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/advertisement')
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

const advertisementPhoto = multer({storage: advertisement}) 

const business = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/business')
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

const businessPhoto = multer({storage: business}) 


const news = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/news')
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

const newsPhoto = multer({storage: news}) 

const motivation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/motivation')
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

const motivationPhoto = multer({storage: motivation}) 

const prayojak = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/prayojak')
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

const prayojakPhoto = multer({storage: prayojak}) 


module.exports = {
    upload,
    upload1,
    upload2,
    upload3,
    suchnaPhoto,
    advertisementPhoto,
    businessPhoto,
    newsPhoto,
    motivationPhoto,
    prayojakPhoto
}