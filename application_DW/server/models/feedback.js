const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedback', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fe_T: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    re_T: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    info: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    auditStatus: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'feedback',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
