//sequelize基础配置文件
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
// const sequelize = new Sequelize('yj','root','eurakaeuraka00000:_:',{
const sequelize = new Sequelize('mydatabase','root','lwy123..',{
	host:'localhost',
	dialect:'mysql',
	// 中文支持
	'dialectOptions': {
		charset: "utf8", //"utf8mb4"
		// collate: "utf8_general_ci",//"utf8mb4_unicode_ci"
		// supportBigNumbers: true,
		// bigNumberStrings: true
	},
	'define': {
		// 'underscored': true,
		'charset':'utf8'
	},
    operatorsAliases:{
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $regexp: Op.regexp,
      $notRegexp: Op.notRegexp,
      $iRegexp: Op.iRegexp,
      $notIRegexp: Op.notIRegexp,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $overlap: Op.overlap,
      $contains: Op.contains,
      $contained: Op.contained,
      $adjacent: Op.adjacent,
      $strictLeft: Op.strictLeft,
      $strictRight: Op.strictRight,
      $noExtendRight: Op.noExtendRight,
      $noExtendLeft: Op.noExtendLeft,
      $and: Op.and,
      $or: Op.or,
      $any: Op.any,
      $all: Op.all,
      $values: Op.values,
      $col: Op.col
    },
})

module.exports = sequelize;

