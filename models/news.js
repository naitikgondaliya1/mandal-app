module.exports = (sequelize, DataTypes) => {
  const news = sequelize.define(
    "news",
    {
      news_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      news: {
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
  return news;
};
