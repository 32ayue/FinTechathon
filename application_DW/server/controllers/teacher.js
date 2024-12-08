const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelizeBase');
const activityModel = require('../models/activity')(SequelizeInstance, Sequelize);
const studentModel = require('../models/student')(SequelizeInstance, Sequelize);
const teacherModel = require('../models/teacher')(SequelizeInstance, Sequelize);
const scoreModel = require('../models/score')(SequelizeInstance, Sequelize);
const clubModel = require('../models/club')(SequelizeInstance, Sequelize);
const complaintModel = require('../models/complaint')(SequelizeInstance, Sequelize);
const collegeModel = require('../models/college')(SequelizeInstance, Sequelize);
const enrollModel = require('../models/enroll')(SequelizeInstance, Sequelize);
const achievementModel = require('../models/achievement')(SequelizeInstance, Sequelize);
const jwt = require('jsonwebtoken');
const moment = require('moment');


// 审核活动
exports.auditActivity = async (ctx)=>{
    const Obj = ctx.request.body
    const actID = Obj.ID
    const auditStatus = Obj.auditStatus
    try{
      const res = await activityModel.update({
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
  
//查询本老师负责的活动
exports.searchActivity = async (ctx)=>{
    const Obj = ctx.query
    const teaID = jwt.decode(ctx.request.header['access-token']);
    // const teaID = jwt.decode(Obj.token);
    const word = Obj.word || '';
    try{
      const colleges = await collegeModel.findAll()
      const activities = await activityModel.findAll({
        // attributes:['ID','name','info'],
        where:{
          '$or':[
            {ID:{'$like':'%'+word+'%'}},
            {info:{'$like':'%'+word+'%'}},
            {name:{'$like':'%'+word+'%'}},
          ],
          teaID:teaID
        },
        include:[{
            attributes:[['name', 'clubName']],
            association: activityModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'clubID', required: true})
          },{
            // attributes:[[Sequelize.fn('count', Sequelize.col('enrolls.ID')), 'enrollNum']], //如果为空，则会被筛去，不会返回0
            association: activityModel.hasMany(enrollModel, {foreignKey:'actID', sourceKey:'ID', required: false}),
            required: false
          },{
            association: activityModel.hasMany(scoreModel, {foreignKey:'actID', sourceKey:'ID', required: false}),
            required: false
          },{
            association: activityModel.hasMany(achievementModel, {foreignKey:'actID', sourceKey:'ID', required: false}),
            required: false
          },{
            association: activityModel.hasMany(complaintModel, {foreignKey:'actID', sourceKey:'ID', required: false}),
            required: false
          }
        ],
        order: [[ Sequelize.col('auditStatus')], [ Sequelize.col('enrollStart'), 'DESC' ]]
      });
      ctx.body = {
        code:0,
        data:activities,
        colleges:colleges
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
  
// 审核活动成果
exports.auditAchievement = async (ctx)=>{
    const Obj = ctx.request.body
    const achID = Obj.ID
    const auditStatus = Obj.auditStatus
    try{
      const res = await achievementModel.update({
        status:auditStatus
      },{where:{
        ID:achID
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

// 审核申诉并修改
exports.auditComplaint = async (ctx)=>{
    const Obj = ctx.request.body
    try{
        if(Obj.auditStatus==1){
            res = await complaintModel.findAll({where:{ ID:Obj.ID }, raw:true});
            await enrollModel.update({
                scoreID:res[0].scoreID_new,
                signIN: 1,
                signOUT: 1
            },{where:{
                stuID:res[0].stuID, actID:res[0].actID
            }});
        }
        await complaintModel.update({
            status:Obj.auditStatus
        },{where:{ ID:Obj.ID }});
        
        ctx.body = {
            code:1,
            message:'已成功修改',
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

//查询活动申诉
exports.searchComplaint = async (ctx)=>{
    const Obj = ctx.query
    const teaID = jwt.decode(Obj.token);
    try{
      const activities_r = await activityModel.findAll({
        attributes:['ID'],
        where:{ teaID:teaID },
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