module.exports = (sequelize, DataTypes) => {
  const business = sequelize.define(
    "business",
    {
      business_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      business_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      owner_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mobile_no: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      business_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return business;
};
