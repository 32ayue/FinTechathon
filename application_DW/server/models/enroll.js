const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('enroll', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    stuID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    actID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    enrollTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    success: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    signIN: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "签到"
    },
    signOUT: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "签退"
    },
    scoreID: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "角色"
    },
    quality: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "活动评分"
    }
  }, {
    sequelize,
    tableName: 'enroll',
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
