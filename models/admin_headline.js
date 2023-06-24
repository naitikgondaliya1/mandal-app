module.exports = (sequelize, DataTypes) => {

    const admin_headline = sequelize.define("admin_headline", {
        admin_headline_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        headline: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: false
    })
    return admin_headline
}