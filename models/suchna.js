module.exports = (sequelize, DataTypes) => {
    const suchna = sequelize.define(
      "suchna",
      {
        suchna_id: {
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
        year: {
          type: DataTypes.TEXT,
          allowNull: false,
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
    return suchna;
  };
  