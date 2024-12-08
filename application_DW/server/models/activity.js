const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    info: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clubID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    T_start: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    T_end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    enrollStart: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    enrollEnd: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    auditStatus: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "审核状态"
    },
    toll: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "报名人数"
    },
    availCollege: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    teaID: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'activity',
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
