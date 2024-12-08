const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    collegeID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    facePic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    faceFeature: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'student',
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
