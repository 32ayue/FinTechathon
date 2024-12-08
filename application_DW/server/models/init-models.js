var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _click = require("./click");
var _club = require("./club");
var _college = require("./college");
var _complaint = require("./complaint");
var _detection = require("./detection");
var _enroll = require("./enroll");
var _feedback = require("./feedback");
var _model = require("./model");
var _score = require("./score");
var _student = require("./student");
var _teacher = require("./teacher");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var click = _click(sequelize, DataTypes);
  var club = _club(sequelize, DataTypes);
  var college = _college(sequelize, DataTypes);
  var complaint = _complaint(sequelize, DataTypes);
  var detection = _detection(sequelize, DataTypes);
  var enroll = _enroll(sequelize, DataTypes);
  var feedback = _feedback(sequelize, DataTypes);
  var model = _model(sequelize, DataTypes);
  var score = _score(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var teacher = _teacher(sequelize, DataTypes);


  return {
    admin,
    click,
    club,
    college,
    complaint,
    detection,
    enroll,
    feedback,
    model,
    score,
    student,
    teacher,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
