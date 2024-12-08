const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelizeBase');
const AdminModel = require('../models/admin')(SequelizeInstance, Sequelize);
const studentModel = require('../models/student')(SequelizeInstance, Sequelize);
const teacherModel = require('../models/teacher')(SequelizeInstance, Sequelize);
const collegeModel = require('../models/college')(SequelizeInstance, Sequelize);
const clubModel = require('../models/club')(SequelizeInstance, Sequelize);
const modelModel = require('../models/model')(SequelizeInstance, Sequelize);
const user_utils = require('./user_utils')
const jwt = require('jsonwebtoken');
const models = {"admin":AdminModel, "teacher":teacherModel,
                "club":clubModel, "student":studentModel,"model":modelModel}
const moment = require('moment');
const json = require('koa-json');
const admin = require('../models/admin');

// //管理员登录
// exports.login = async (ctx)=>{
//     // await user_utils.login(ctx, AdminModel)
//     await user_utils.login1(ctx)
// }

// //管理员修改密码
// exports.changePwd = async (ctx)=>{
//     await user_utils.changePwd(ctx, AdminModel)
// }

async function findRole (ID){
  // 查看账号权限等级
  for (var role in models){
      signed = await models[role].findOne({where: { ID: ID }})
      // console.log(ID+role)
      if(signed){ return {"role":role, "accountSigned":signed, "model":models[role]} }
  }
  return false
}

//查询所有学生
exports.getAllStudent = async (ctx)=>{
    try{
      const users = await studentModel.findAll({
        attributes:['ID','phoneNumber','name','sex','collegeID','class','facePic']
      });
      ctx.body = {
        code:0,
        data:users
      }
    }
    catch(e){
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
    }
}

//删除学生
exports.deleteStudent = async (ctx)=>{
  const id = ctx.query.id;
  try{
    const res = await studentModel.destroy({
      where:{
        ID:id
      }
    });
    const users = await studentModel.findAll({      
      where:{
        ID:id
      }
    });
    if(users.length===0){
      ctx.body = {
        code:1,
        message:'已删除'
      }
    }else{
      ctx.body = {
        code:0,
        message:'未删除'
      }
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//查询指定学生
exports.searchStudent = async (ctx)=>{
  const word = ctx.query.word;
  console.log(word)
  try{
    const users = await studentModel.findAll({
      attributes:['ID','phoneNumber','name','sex','collegeID','class','facePic'],
      where:{
        '$or':[
          {ID:{'$like':'%'+word+'%'}},
          {phoneNumber:{'$like':'%'+word+'%'}},
          {name:{'$like':'%'+word+'%'}},
          {sex:{'$like':'%'+word+'%'}},
          {class:{'$like':'%'+word+'%'}},
        ]
      }
    });
    ctx.body = {
      code:0,
      data:users
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

//新增学生
exports.addStudent = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    const res = await studentModel.create({
      ID:Obj.ID,
      phoneNumber:Obj.phoneNumber,
      password:Obj.password,
      name:Obj.name,
      collegeID:Obj.collegeID,
      sex:Obj.sex,
      class:Obj.class,
    });
    const users = await studentModel.findAll({      
      where:{
        '$and':[
          {ID:Obj.ID},
          {name:Obj.name},
          {class:Obj.class},
          {collegeID:Obj.collegeID},
          {sex:Obj.sex},
          {phoneNumber:Obj.phoneNumber},
          {password:Obj.password}
        ]
      }
    });
    console.log(users)
    if(users.length===1){
      ctx.body = {
        code:1,
        message:'已成功新增'
      }
    }else{
      ctx.body = {
        code:0,
        message:'未成功新增'
      }
    }
  }
  catch(e){
    if(e.errors[0].message=='PRIMARY must be unique'){
      ctx.body = {
        code:0,
        message:'已存在相同用户'
      }
    }else{
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
      console.log(e)
    }
  }
}


//新增老师
exports.addTeacher = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    const res = await teacherModel.create({
      ID:Obj.ID,
      name:Obj.name,
      permissionLevel:Obj.permissionLevel,
      collegeID:Obj.collegeID,
      sex:Obj.sex,
      phoneNumber:Obj.phoneNumber,
      password:Obj.password
    });
    const users = await teacherModel.findAll({      
      where:{
        '$and':[
          {ID:Obj.ID},
          {name:Obj.name},
          {permissionLevel:Obj.permissionLevel},
          {collegeID:Obj.collegeID},
          {sex:Obj.sex},
          {phoneNumber:Obj.phoneNumber},
          {password:Obj.password}
        ]
      }
    });
    console.log(users)
    if(users.length===1){
      ctx.body = {
        code:1,
        message:'已成功新增'
      }
    }else{
      ctx.body = {
        code:0,
        message:'未成功新增'
      }
    }
  }
  catch(e){
    if(e.errors[0].message=='PRIMARY must be unique'){
      ctx.body = {
        code:0,
        message:'已存在相同用户'
      }
    }else{
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
      console.log(e)
    }
  }
}

//查询所有老师
exports.getAllTeacher = async (ctx)=>{
  try{
    const users = await teacherModel.findAll({
      attributes:['ID','phoneNumber','name','sex','collegeID','permissionLevel']
    });
    ctx.body = {
      code:0,
      data:users
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}

//删除老师
exports.deleteTeacher = async (ctx)=>{
const id = ctx.query.id;
try{
  const res = await teacherModel.destroy({
    where:{
      ID:id
    }
  });
  const users = await teacherModel.findAll({      
    where:{
      ID:id
    }
  });
  if(users.length===0){
    ctx.body = {
      code:1,
      message:'已删除'
    }
  }else{
    ctx.body = {
      code:0,
      message:'未删除'
    }
  }
}
catch(e){
  ctx.body = {
    code:10000,
    message:'网络出错'
  }
}
}

//查询指定老师
exports.searchTeacher = async (ctx)=>{
const word = ctx.query.word;
console.log(word)
try{
  const users = await teacherModel.findAll({
    attributes:['ID','phoneNumber','name','sex','collegeID','permissionLevel'],
    where:{
      '$or':[
        {ID:{'$like':'%'+word+'%'}},
        {phoneNumber:{'$like':'%'+word+'%'}},
        {name:{'$like':'%'+word+'%'}},
        {sex:{'$like':'%'+word+'%'}},
        {class:{'$like':'%'+word+'%'}},
      ]
    }
  });
  ctx.body = {
    code:0,
    data:users
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

//新增社团
exports.addClub = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    const res = await clubModel.create({
      ID:Obj.ID,
      name:Obj.name,
      phoneNumber:Obj.phoneNumber,
      password:Obj.password,
      collegeID:Obj.collegeID,
      info:Obj.info,
      leader:Obj.leader,
      teaID:Obj.teaID
    });


      ctx.body = {
        code:1,
        message:'已成功新增'
      }

  }
  catch(e){
    if(e.errors[0].message=='PRIMARY must be unique'){
      ctx.body = {
        code:0,
        message:'已存在相同社团'
      }
    }else{
      ctx.body = {
        code:10000,
        message:'网络出错'
      }
      console.log(e)
    }
  }
}

//查询所有学院
exports.getAllCollege = async (ctx)=>{
  try{
    const colleges = await collegeModel.findAll();
    ctx.body = {
      code:0,
      data:colleges
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'+e
    }
  }
}

//查询所有用户
exports.searchAllUser = async (ctx)=>{
  try{
    const word = ctx.query.word || '';
    const model = models[ctx.query.model];
    const attr = {
      "teacher" : ['ID','phoneNumber','name','sex','collegeID', 'password', 'permissionLevel'],
      "student" : ['ID','phoneNumber','name','sex','collegeID', 'password'],
      "club" : ['ID','phoneNumber','name','collegeID', 'info', 'teaID', 'leader', 'password'],
    }
    var ors = [
      {ID:{'$like':'%'+word+'%'}},
      {phoneNumber:{'$like':'%'+word+'%'}},
      {name:{'$like':'%'+word+'%'}}
    ]
    if (ctx.query.model === 'student') {
      ors.push({class:{'$like':'%'+word+'%'}})
    }
    if (ctx.query.model === 'club') {
      ors.push({info:{'$like':'%'+word+'%'}})
      ors.push({leader:{'$like':'%'+word+'%'}})
    }
    const res = await model.findAll({
      attributes: attr[ctx.query.model],
      where:{
        '$or': ors
      },
      include:[{
        attributes: ['name'],
        association: model.hasOne(collegeModel, {foreignKey:'ID', sourceKey:'collegeID', required: true})
      }],
      raw: true
    });
    // console.log('res', res)
    ctx.body = {
      code:0,
      data:res
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'+e
    }
  }
}

//删除用户
exports.deleteUser = async (ctx)=>{
  const ids = ctx.request.body.ID;
  try{
    for (i in ids) {
      const id = ids[i]
      const role = await findRole(id)
      if (role.accountSigned) {
        await role.model.destroy({where:{ID:id}})
      }
    }
    ctx.body = {
      code:0,
      message:'成功'
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'+e
    }
  }
}


// 批量新增用户
exports.addUser = async (ctx)=>{
  const Obj = ctx.request.body
  const roles = Obj.roles
  const datas = Obj.datas
  try{
    const colleges = await collegeModel.findAll({raw:true})
    for (const i in roles) {
      const model = models[roles[i]]
      var data = datas[i]
      data = JSON.parse(JSON.stringify(data)
        .replace(/学号/g, 'ID').replace(/姓名/g, 'name').replace(/初始密码/g, 'password')
        .replace(/性别/g, 'sex').replace(/"男"/g, '1').replace(/"女"/g, '2').replace(/权限等级/g, 'permissionLevel')
        .replace(/负责人手机号/g, 'phoneNumber').replace(/手机号/g, 'phoneNumber').replace(/班级/g, 'class')
        .replace(/社团名称/g, 'name').replace(/社团简介/g, 'info').replace(/学院/g, 'college')
        .replace(/教师编号/g, 'ID').replace(/负责教师/g, 'teaID').replace(/负责人/g, 'leader')
        )
      for (const j in data) {
        data[j].collegeID = colleges.find((v)=>v.name === data[j].college).ID
      }
      // console.log(roles[i], data)
      const res = await model.bulkCreate(data)
      // console.log(roles[i] + 'result', res)
    }
    ctx.body = {
      code:1,
      message:'已成功新增'
    }
  }
  catch(e){
    console.log(e)
    if(e.errors[0].message=='PRIMARY must be unique'){
      ctx.body = {
        code:0,
        message:'已存在相同ID的用户'
      }
    }else{
      ctx.body = {
        code:10000,
        message:'网络出错'+e
      }
      console.log(e)
    }
  }
}


// 修改模型状态
exports.updateTea = async (ctx)=>{
  const Obj = ctx.request.body
  try{
    const res = await modelModel.update({status:Obj.status},{where:{ID:Obj.ID}});
    if (res) {
      ctx.body = {
        code:1,
        message:'已成功新增'
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


//查询所有模型
exports.searchAllModels = async (ctx)=>{
  try{
    const word = ctx.query.word || '';
    const model = models[ctx.query.model];
    const res = await model.findAll({
      include:[{
        attributes: ['name'],
        association: model.hasOne(AdminModel, {foreignKey:'ID', sourceKey:'admin_id', required: true})
      }],
    });
    // console.log('res', res)
    ctx.body = {
      code:0,
      data:res
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'+e
    }
  }
}

//上传模型
exports.addFileList = async (ctx)=>{
  const Obj = ctx.request.body
	const clubID = jwt.decode(ctx.request.header['access-token']);
  // const clubID = jwt.decode(Obj.token);
  try{
    newID = await modelModel.max('ID')
    newID = Math.max(newID+1, 80000)
    const res = await activityModel.create({
      ID:newID,
      name:Obj.name,
      file:Obj.path
      // info:Obj.info,
      // clubID:clubID,
      // T_start:moment(Obj.T_start).format('MM/DD/YYYY'),
      // T_end:moment(Obj.T_end).format('MM/DD/YYYY'),
      // enrollStart:moment(Obj.enrollStart).format('MM/DD/YYYY'),
      // enrollEnd:moment(Obj.enrollEnd).format('MM/DD/YYYY'),
      // auditStatus:0,
      // toll:Obj.toll,
      // availCollege:Obj.availCollege,
      // teaID:Obj.teaID
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
    // if(e.errors[0].message=='PRIMARY must be unique'){
    //   ctx.body = {
    //     code:0,
    //     message:'已存在相同编号活动'
    //   }
    // }else{
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
    // }
  }
}