const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('complaint', {
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
    info: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    scoreID_pre: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    scoreID_new: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'complaint',
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
