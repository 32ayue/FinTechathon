const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelizeBase');
const activityModel = require('../models/activity')(SequelizeInstance, Sequelize);
const scoreModel = require('../models/score')(SequelizeInstance, Sequelize);
const studentModel = require('../models/student')(SequelizeInstance, Sequelize);
const achievementModel = require('../models/achievement')(SequelizeInstance, Sequelize);
const clubModel = require('../models/club')(SequelizeInstance, Sequelize);
const clickModel = require('../models/click')(SequelizeInstance, Sequelize);
const enrollModel = require('../models/enroll')(SequelizeInstance, Sequelize);
const complaintModel = require('../models/complaint')(SequelizeInstance, Sequelize);
const detectionModel = require('../models/detection')(SequelizeInstance, Sequelize);
const feedbackModel = require('../models/feedback')(SequelizeInstance, Sequelize);
const jwt = require('jsonwebtoken');
const moment = require('moment');
const fs = require('fs')
const path = require("path");
const sequelize = require('../config/sequelizeBase');

// 删除活动
exports.removeActivity = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    await activityModel.destroy({where:{ID:Obj.actID}});
    await scoreModel.destroy({where:{actID:Obj.actID}});
    await enrollModel.destroy({where:{actID:Obj.actID}});
    await clickModel.destroy({where:{actID:Obj.actID}});
    await complaintModel.destroy({where:{actID:Obj.actID}});
      ctx.body = {
        code:1,
        message:'已成功'
      }
  }
  catch(e){
    console.log(e)
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
  }
}

// 新增活动
exports.addActivity = async (ctx)=>{
  const Obj = ctx.request.body
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  try{
    newID = await activityModel.max('ID')
    newID = Math.max(newID+1, 80000)
    const res = await activityModel.create({
      ID:newID,
      name:Obj.name,
      info:Obj.info,
      clubID:clubID,
      T_start:moment(Obj.T_start).format('MM/DD/YYYY'),
      T_end:moment(Obj.T_end).format('MM/DD/YYYY'),
      enrollStart:moment(Obj.enrollStart).format('MM/DD/YYYY'),
      enrollEnd:moment(Obj.enrollEnd).format('MM/DD/YYYY'),
      auditStatus:0,
      toll:Obj.toll,
      availCollege:Obj.availCollege,
      teaID:Obj.teaID
    });
    if(res){
      ctx.body = {
        code:1,
        message:'已成功新增',
        ID: newID
      }
    }else{
      ctx.body = {
        code:0,
        message:'未成功新增'
      }
    }
  }
  catch(e){
    console.log(e)
    if(e.errors[0].message=='PRIMARY must be unique'){
      ctx.body = {
        code:0,
        message:'已存在相同编号活动'
      }
    }else{
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
    }
  }
}

// 修改活动
exports.updateActivity = async (ctx)=>{
  const Obj = ctx.request.body
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  const ID = Obj.ID
  try{
    const res = await activityModel.update({
      name:Obj.name,
      info:Obj.info,
      // clubID:clubID,
      T_start:moment(Obj.T_start).format('MM/DD/YYYY'),
      T_end:moment(Obj.T_end).format('MM/DD/YYYY'),
      enrollStart:moment(Obj.enrollStart).format('MM/DD/YYYY'),
      enrollEnd:moment(Obj.enrollEnd).format('MM/DD/YYYY'),
      auditStatus: 0,
      toll:Obj.toll,
      availCollege:Obj.availCollege,
      teaID:Obj.teaID
    },{where:{
      ID:ID,
      clubID:clubID
    }});
    if(res){
      ctx.body = {
        code:1,
        message:'已成功修改',
      }
    }else{
      ctx.body = {
        code:0,
        message:'未成功修改'
      }
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//查询本社团的活动
exports.searchActivity = async (ctx)=>{
  const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  const word = Obj.word || '';
  try{
    const activities = await activityModel.findAll({
      // attributes:['ID','name','info'],
      where:{
        '$or':[
          {ID:{'$like':'%'+word+'%'}},
          {info:{'$like':'%'+word+'%'}},
          {name:{'$like':'%'+word+'%'}},
        ],
        clubID:clubID
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
    var audit = [0, 0, 0]
    for (var act in activities) {
      audit[activities[act].auditStatus] += 1
    }
    ctx.body = {
      code:0,
      data:activities,
      audit: [String(audit[0]) + '个', String(audit[1]) + '个', String(audit[2]) + '个']
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

// 新增活动分数
exports.addScore = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    // remove = await scoreModel.destroy({where:{actID:Obj.actID}})
    console.log('addScore', Obj)
    // newID = await scoreModel.max('ID')
    // newID = Math.max(newID+1, 80000)
    const res = await scoreModel.create({
      // ID:newID, 
      actID:Obj.actID, name:Obj.name, score:Obj.score
    });
    ctx.body = {
      code:1,
      message:'已成功新增',
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

// 新增活动分数
exports.removeScore = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    remove = await scoreModel.destroy({where:{actID:Obj.actID}})
    ctx.body = {
      code:1,
      message:'已成',
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//查询活动分数
exports.searchScore = async (ctx)=>{
  const Obj = ctx.query
  const actID = Obj.actID;
  try{
    const scores = await scoreModel.findAll({
      where:{
        actID:actID
      }
    });
    ctx.body = {
      code:0,
      data:scores
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

function upload (file, filePath) {
	try{
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

// 新增活动成果
exports.addAchievement = async (ctx)=>{
  try{
    const Obj = JSON.parse(ctx.request.body.info)
    const file = ctx.request.files.file; // 获取上传文件
    last = file.name.split(".")
    last = last[last.length-1] //文件名后缀
    fname = Obj.actID.toString()+"."+last
    url = path.join('acievements', fname)
    let filePath = path.join(__dirname, '..', 'public/acievements', fname);
    upload(file, filePath)
    newID = await achievementModel.max('ID')
    newID = Math.max(newID+1, 80000)
    const res = await achievementModel.create({
      ID:newID, actID:Obj.actID, name:Obj.name, info:Obj.info, file:url, level:Obj.level, 
      time:new Date(), status:0
    });
    ctx.body = {
      code:1,
      message:'已成功新增',
      url: url
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'+e
    }
  }
}

//查询活动评分
exports.searchQuality = async (ctx)=>{
  const Obj = ctx.query
  try{
    const avg_quality = await enrollModel.findAll({
      // attributes:['quality'],
      attributes:['actID', [Sequelize.fn('AVG', Sequelize.col('quality')), 'avg_quality']],
      where:{
        // actID:Obj.actID,
        signIN:1,
        signOUT:1
      },
      group:'actID'
    });
    ctx.body = {
      code:0,
      data:avg_quality
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

// 签到
exports.sign = async (ctx)=>{
  const Obj = ctx.request.body
	// const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  try{
    // const scores = await enrollModel.findAll({
    //   where: {
    //     actID: Obj.actID,
    //     stuID: {'$in':Obj.stuIDs}
    //   },
    //   include:[{
    //       association: enrollModel.hasMany(scoreModel, {foreignKey:'ID', sourceKey:'scoreID', required: false})
    //     },{
    //       association: enrollModel.hasOne(studentModel, {foreignKey:'ID', sourceKey:'stuID', required: false})
    //     }
    //   ]
    // })
    // const res = await enrollModel.bulkCreate(
    //   Obj.valueArr,
    //   {updateOnDuplicate:["actID", "stuID"]}
    // )
    const res = await enrollModel.update(
      Obj.newSign,
      {
        where: {
          actID: Obj.actID,
          stuID: {'$in':Obj.stuIDs}
        }
      }
    )
    ctx.body = {
      code:1,
      message:'已成功修改',
      data: res
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}


// 新增活动分数
exports.addDetection = async (ctx)=>{
  // const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  const result = 1;
  const data = new Date();
  console.log('内容', ctx)
  try{
    // remove = await scoreModel.destroy({where:{actID:Obj.actID}})
    // console.log('addScore', Obj)
    // newID = await scoreModel.max('ID')
    // newID = Math.max(newID+1, 80000)
    const res = await detectionModel.create({
      // ID : 10881, 
      // actID:Obj.actID, name:Obj.name, score:Obj.score
      website : ctx.request.body.website,
      userId : clubID,
      result : result,
      date : data,
    });
    ctx.body = {
      code:1,
      message:'已成功新增',
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//搜索所有检测记录
exports.searchDetection = async (ctx)=>{
  const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  const word = Obj.word || '';
  try{
    const detections = await detectionModel.findAll({
      // attributes:['ID','name','info'],
      include:[{
          attributes:[['name', 'clubName']],
          association: detectionModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'userId', required: true})
        }
      ],
      // order: [[ Sequelize.col('enrollEnd'), 'DESC' ]]
    });
    ctx.body = {
      code:0,
      data:detections,
      // audit: [String(audit[0]) + '个', String(audit[1]) + '个', String(audit[2]) + '个']
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

//搜索当前用户的检测记录
exports.searchmyDetection = async (ctx)=>{
  const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  console.log(clubID)
  const word = Obj.word || '';
  try{
    const detections = await detectionModel.findAll({
      // attributes:['ID','name','info'],
      where:{
        // actID:Obj.actID,
        userId:clubID
      },
      include:[{
          attributes:[['name', 'clubName']],
          association: detectionModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'userId', required: true})
        }
      ],
      // order: [[ Sequelize.col('enrollEnd'), 'DESC' ]]
    });
    ctx.body = {
      code:0,
      data:detections,
      // audit: [String(audit[0]) + '个', String(audit[1]) + '个', String(audit[2]) + '个']
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

// 新增活动分数
exports.addFeedback = async (ctx)=>{
  // const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  console.log('id是', clubID)
  const result = 0;
  const data = new Date();
  console.log('内容', ctx)
  try{
    // remove = await scoreModel.destroy({where:{actID:Obj.actID}})
    // console.log('addScore', Obj)
    // newID = await scoreModel.max('ID')
    // newID = Math.max(newID+1, 80000)
    const res = await feedbackModel.create({
      // ID : 10881, 
      // actID:Obj.actID, name:Obj.name, score:Obj.score
      website : ctx.request.body.website,
      info : ctx.request.body.info,
      userId : clubID,
      auditStatus : result,
      fe_T : data,
    });
    ctx.body = {
      code:1,
      message:'已成功新增',
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//搜索所有检测记录
exports.searchFeedback = async (ctx)=>{
  const Obj = ctx.query
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  const word = Obj.word || '';
  try{
    const detections = await feedbackModel.findAll({
      // attributes:['ID','name','info'],
      include:[{
          attributes:[['name', 'clubName']],
          association: feedbackModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'userId', required: true})
        }
      ],
      // order: [[ Sequelize.col('enrollEnd'), 'DESC' ]]
    });
    ctx.body = {
      code:0,
      data:detections,
      // audit: [String(audit[0]) + '个', String(audit[1]) + '个', String(audit[2]) + '个']
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

exports.auditFeedback = async (ctx)=>{
  const Obj = ctx.request.body
  const actID = Obj.ID
  const auditStatus = Obj.auditStatus
  try{
    const res = await feedbackModel.update({
      auditStatus:auditStatus
    },{where:{
      ID:actID
    }});
    if(res){
      ctx.body = {
        code:1,
        message:'已成功修改',
      }
    }else{
      ctx.body = {
        code:0,
        message:'未成功修改'
      }
    }
  }
  catch(e){
    console.log(e)
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}
