const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize("mandal", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
})

try {
    sequelize.authenticate()
    console.log("database connection success")
} catch (error) {
    console.log(error)
}



const db = {};

db.sequelize = sequelize
db.Sequelize = Sequelize


db.admin = require("../models/admin.js")(sequelize, DataTypes);
db.admin_headline = require("../models/admin_headline.js")(sequelize, DataTypes);
db.mukhiya = require("../models/mukhiya.js")(sequelize, DataTypes);
db.slider = require("../models/slider.js")(sequelize, DataTypes);
db.member_detail = require("../models/member.js")(sequelize, DataTypes);






sequelize.sync({ force: false, alter: true })

module.exports = db