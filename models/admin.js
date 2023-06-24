module.exports = (sequelize, DataTypes) => {

    const admin = sequelize.define("admin", {
        admin_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        auth_token: {
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
    return admin;
}