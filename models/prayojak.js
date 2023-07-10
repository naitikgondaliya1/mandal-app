module.exports = (sequelize, DataTypes) => {
  const prayojak = sequelize.define(
    "prayojak",
    {
      prayojak_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mobile_no: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      village: {
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
  return prayojak;
};
