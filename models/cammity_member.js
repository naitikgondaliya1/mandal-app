module.exports = (sequelize, DataTypes) => {

    const cammity_member = sequelize.define("cammity_member", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        type: {
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
    return cammity_member;
}