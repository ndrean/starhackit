module.exports = function (sequelize, DataTypes) {
  const Itinary = sequelize.define(
    "Itinary",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      from: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      to: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "itinary",
    }
  );
  Itinary.associate = function (models) {
    Itinary.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
    });
    models.User.hasMany(models.Itinary, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
    });
  };
  return Itinary;
};
