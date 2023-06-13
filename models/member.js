module.exports = (sequelize, DataTypes) => {

    const member_detail = sequelize.define("member_detail", {
        member_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        mukhiya_auth_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        mukhiya_member_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        member_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        member_profile_photo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        member_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        middle_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        birth_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        country_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        city_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        village_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        maternal_village_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        blood_group: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cast: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        marriage_status: {
            type: DataTypes.ENUM,
            values: ['MARRIED', 'UNMARRIED'],
            defaultValue: 'MARRIED'
        },
        education: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        bussiness: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        social_media_link: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        adress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        business_adress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
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
    }, { timestamps: false })
    return member_detail
}