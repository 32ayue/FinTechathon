const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelizeBase');
const studentModel = require('../models/student')(SequelizeInstance, Sequelize);
const activityModel = require('../models/activity')(SequelizeInstance, Sequelize);
const enrollModel = require('../models/enroll')(SequelizeInstance, Sequelize);
const clubModel = require('../models/club')(SequelizeInstance, Sequelize);
const complaintModel = require('../models/complaint')(SequelizeInstance, Sequelize);
const scoreModel = require('../models/score')(SequelizeInstance, Sequelize);
const achievementModel = require('../models/achievement')(SequelizeInstance, Sequelize);
const user_utils = require('../controllers/user_utils')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require("path")
// const token = jwt.sign(res.id,'chambers');
// const userId = jwt.verify(ctx.query.token,'chambers');
const moment = require('moment');
// time:moment(msg.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
// createtime:new Date()
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);
// const hashPwd = bcrypt.hashSync(ctx.request.body.pwd, salt);
// !bcrypt.compareSync(data.oldPwd, account.pwd)

// const specs = await student.findAll({
//     // attributes:['phoneNumber'],
//     where:{
//         ID:10001,
//     },
// }); specs.length===0
// const res = await ReplyModel.create({
//     messageId:replyObj.id,
//     content:replyObj.content,
//     createtime:new Date()
// });
// const res2 = await MessageModel.update(
//       {
//         state:1
//       },
//       {
//         where: {
//           id:replyObj.id
//         }
//       }
// );
// const reply = await ReplyModel.findOne({
//     attributes:['content'],
//     where:{
//         messageId:msg.dataValues.id
//     }
// });


//查询活动，该学生的学院可见且已通过审核，并在时间范围内
exports.searchActivity = async (ctx)=>{
	const Obj = ctx.query
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
	const word = Obj.word || '';
	try{
	  stuCollege = await studentModel.findAll({attributes:['collegeID'], where:{ID:stuID}})
	  stuCollege = stuCollege[0]['collegeID']
	  const activities = await activityModel.findAll({
		// attributes:['ID','name','info'],
		where:{
		  '$or':[
			{ID:{'$like':'%'+word+'%'}},
			{info:{'$like':'%'+word+'%'}},
			{name:{'$like':'%'+word+'%'}},
		  ],
		  auditStatus:1,
		  availCollege:{'$like':'%'+stuCollege+'%'},
		  enrollStart:{'$lt':new Date()},
		  T_end:{'$gt':new Date()}
		},
		include:[{
				attributes:[['name', 'clubName']],
				association: activityModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'clubID', required: true})
			},{
				// attributes:[[Sequelize.fn('count', Sequelize.col('enrolls.ID')), 'enrollNum']], //如果为空，则会被筛去，不会返回0
				association: activityModel.hasMany(enrollModel, {foreignKey:'actID', sourceKey:'ID', required: false})
			},{
				association: activityModel.hasMany(scoreModel, {foreignKey:'actID', sourceKey:'ID', required: false})
			},{
				association: activityModel.hasMany(achievementModel, {foreignKey:'actID', sourceKey:'ID', required: false})
			  }
		],
		order: [[ Sequelize.col('enrollEnd'), 'DESC' ]]
	  });
	//   console.log(activities)
	  ctx.body = {
		code:0,
		data:activities
	  }
	}
	catch(e){
	  ctx.body = {
		code:10000,
		message:'网络出错'
	  }
	  console.log(e)
	}
}

//报名活动，有名额且已经审核求学院允许且在报名时间内
exports.enrollActivity = async (ctx)=>{
	const Obj = ctx.request.body
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
	const actID = Obj.actID;
	const scoreID = Obj.scoreID
	try{
		stuCollege = await studentModel.findAll({attributes:['collegeID'], where:{ID:stuID}})
		stuCollege = stuCollege[0]['collegeID']
		const enrolled = await enrollModel.count({where:{actID:actID}})
		const activities = await activityModel.findAll({
			attributes:['toll', 'enrollStart', 'enrollEnd'],
			where:{
				ID:actID,
				toll:{'$gt':enrolled},
				auditStatus:1,
				availCollege:{'$like':'%'+stuCollege+'%'},
				enrollStart:{'$lte':new Date()},
				enrollEnd:{'$gte':new Date()}
			}
		});
		const enrolledStu = await enrollModel.findAll({where:{stuID:stuID, actID:actID}})
		if(enrolledStu.length>=1) {
			ctx.body = {
				code:0,
				data:'您已报名！',
				message:'您已报名，请勿重复报名'
			}
			return 
		}
		if(activities.length===1){
			newID = await enrollModel.max('ID')
			newID = Math.max(newID+1, 20000)
			await enrollModel.create({
				ID:newID, stuID:stuID, actID:actID, enrollTime:moment(), scoreID:scoreID
			})
			ctx.body = {
				code:1,
				data:'报名成功！'
			}
		}else{
			ctx.body = {
				code:0,
				data:'无法报名！',
				message:'报名失败，请检查报名时间是否符合'
			}
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
		}
}

//取消报名活动
exports.unenrollActivity = async (ctx)=>{
	const Obj = ctx.request.body
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
	const actID = Obj.actID;
	try{
		const enrolledStu = await enrollModel.findAll({where:{stuID:stuID, actID:actID}})
		if(enrolledStu.length>=1) {
			await enrollModel.destroy({where:{stuID:stuID, actID:actID}})
			ctx.body = {
				code:1,
				data:'取消成功！',
			}
		}else{
			ctx.body = {
				code:0,
				data:'无法取消报名！',
				message:'你并没有报名'
			}
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
		}
}

function upload (file, fname) {
	try{
        let filePath = path.join(__dirname, '..', 'public/faces', fname);
        // 如果本地已经有同名文件，需要先删除
        if (fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    }
    catch(e){
        console.log(e);
        // 防止文件占用
        reader.close()
        upStream.close()
    }
}
// 照片
exports.uploadFacepic = async (ctx)=>{
	const Obj = ctx.request.body
	const stuID = jwt.decode(Obj.token);
	const file = ctx.request.files.file; // 获取上传文件
	last = file.name.split(".")
	last = last[last.length-1] //文件名后缀
	fname = stuID.toString()+"."+last
	url = path.join('faces', fname);
	try{
		await studentModel.update({facePic:url}, {where:{ID:stuID}})
		upload(file, fname)
		ctx.body = {
			code:1,
			data:'上传成功！'}
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

//活动打分
exports.ratingActivity = async (ctx)=>{
	const Obj = ctx.request.body
	const stuID = jwt.decode(ctx.request.header['access-token']);
	// const stuID = jwt.decode(Obj.token);
	try{
		await enrollModel.update({
			quality:Obj.quality
		},{where:{actID:Obj.actID, stuID:stuID}})
		ctx.body = {
			code:1,
			data:'评分成功！',
			message:'评分成功！'
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
		}
}

//活动申诉
exports.complaintActivity = async (ctx)=>{
	const Obj = ctx.request.body
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
	try{
		newID = await complaintModel.max('ID')
		newID = Math.max(newID+1, 20000)
		scoreID_pre =  await enrollModel.findAll({
			attributes:['scoreID'],
			where:{stuID:stuID, actID:Obj.actID},
			raw:true
		})
		await complaintModel.create({
			ID:newID, stuID:stuID, actID:Obj.actID,
			info:Obj.info, status:0, time:new Date(), 
			scoreID_pre:scoreID_pre[0].scoreID, scoreID_new:Obj.scoreID_new
		})
		ctx.body = {
			code:1,
			data:'申诉申请成功',
			message: '申诉申请成功！'
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
		}
}

//查询活动申诉
exports.searchComplaint = async (ctx)=>{
    const Obj = ctx.query
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
    try{
      const activities_r = await activityModel.findAll({
        attributes:['ID'],
        where:{ stuID:stuID },
        raw:true
      });
      var activities = []
      for (x in activities_r){
        activities.push(activities_r[x].ID)
      }
      complaints = await complaintModel.findAll({
        where:{actID:{'$in':activities}}
      })
      ctx.body = {
        code:0,
        data:complaints
      }
    }
    catch(e){
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
      console.log(e)
    }
}

//查询得分和已参加活动个数
exports.searchScore = async (ctx)=>{
	const Obj = ctx.query
	// const stuID = jwt.decode(Obj.token);
	const stuID = jwt.decode(ctx.request.header['access-token']);
	try{
	  // 筛选成功参加的活动
	  res = await enrollModel.findAll({
		  where:{stuID:stuID, signIN:1, signOUT:1},
		  include:[{
			association: enrollModel.hasOne(scoreModel, {foreignKey:'ID', sourceKey:'scoreID', required: true})
		  }],
		  raw:true
	  })
	  // 报名但未参加的活动
	  resEnrolled = await enrollModel.findAll({
		  attributes:['actID'],
		  where:{stuID:stuID, signIN:null, signOUT:null},
		  raw:true
	  })
	  var score = 0.0
	  for (i in res) {
		score += res[i]['score.score']
	  }
	  var enrolled = []
	  for (x in resEnrolled){
		enrolled.push(resEnrolled[x].actID)
	  }
	  var joined = []
	  for (x in res){
		joined.push(res[x].actID)
	  }
	  ctx.body = {
		code:0,
		data:{score:score, len:res.length, enrolled:enrolled, joined:joined}
	  }
	}
	catch(e){
	  ctx.body = {
		code:10000,
		message:'网络出错'+e
	  }
	  console.log(e)
	}
}