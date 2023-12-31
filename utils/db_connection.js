const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

try {
    sequelize.authenticate()
    console.log("database connection success")
} catch (error) {
    console.log("=====>>>>",error)
}



const db = {};

db.sequelize = sequelize
db.Sequelize = Sequelize


db.admin = require("../models/admin.js")(sequelize, DataTypes);
db.admin_headline = require("../models/admin_headline.js")(sequelize, DataTypes);
db.mukhiya = require("../models/mukhiya.js")(sequelize, DataTypes);
db.slider = require("../models/slider.js")(sequelize, DataTypes);
db.member_detail = require("../models/member.js")(sequelize, DataTypes);
db.cammity_member = require("../models/cammity_member.js")(sequelize, DataTypes)
db.event = require("../models/event.js")(sequelize, DataTypes)
db.suchna = require("../models/suchna.js")(sequelize, DataTypes)
db.advertisement = require("../models/advertisement.js")(sequelize, DataTypes)
db.news = require("../models/news.js")(sequelize, DataTypes)
db.motivations = require("../models/motivations.js")(sequelize,DataTypes)
db.business = require("../models/business.js")(sequelize, DataTypes)
db.prayojak = require("../models/prayojak.js")(sequelize, DataTypes)
sequelize.sync({ force: false, alter: true })

module.exports = db