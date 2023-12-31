module.exports = (sequelize, DataTypes) => {
    const motivation = sequelize.define(
      "motivations",
      {
        motivation_id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        photo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        motivation_By: {
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
    return motivation;
  };
  