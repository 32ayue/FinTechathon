const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelizeBase');
const AdminModel = require('../models/admin')(SequelizeInstance, Sequelize);
const studentModel = require('../models/student')(SequelizeInstance, Sequelize);
const activityModel = require('../models/activity')(SequelizeInstance, Sequelize);
const achievementModel = require('../models/achievement')(SequelizeInstance, Sequelize);
const teacherModel = require('../models/teacher')(SequelizeInstance, Sequelize);
const clubModel = require('../models/club')(SequelizeInstance, Sequelize);
const enrollModel = require('../models/enroll')(SequelizeInstance, Sequelize);
const clickModel = require('../models/click')(SequelizeInstance, Sequelize);
const collegeModel = require('../models/college')(SequelizeInstance, Sequelize);
var models = {"admin":AdminModel, "teacher":teacherModel,
                "club":clubModel, "student":studentModel}
const jwt = require('jsonwebtoken');
const achievement = require('../models/achievement');

const responseBody = {
  message: '',
  timestamp: 0,
  result: null,
  code: 0
}

const builder = (data, message, code = 0, headers = {}) => {
  responseBody.result = data
  if (message !== undefined && message !== null) {
    responseBody.message = message
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  // console.log(responseBody)
  return responseBody
}

const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

async function findRole (ID){
    // 查看账号权限等级
    for (var role in models){
        signed = await models[role].findOne({where: { ID: ID }})
        // console.log(ID+role)
        if(signed){ return {"role":role, "accountSigned":signed, "model":models[role]} }
    }
    return false
}

//修改密码
exports.changePwd = async function changePwd (ctx){
    const pwdObj = ctx.request.body;
    const ID = jwt.decode(ctx.request.header['access-token']);
    // const ID = jwt.decode(pwdObj.adminToken);
    // console.log(ctx.request)
    try{
        role = await findRole(ID)
        const adminOldPwd = await role["model"].findOne({
            attributes:['password'],
            where:{ ID:ID } });
      if(adminOldPwd.password!==pwdObj.oldPwd){
        ctx.body = {
          code:0,
          message:'旧密码错误'
        }
        return;
      }
      const res = await role["model"].update(
        { password:pwdObj.newPwd },
        { where: { ID:ID } }
      )
      ctx.body = {
        code:1,
        message:'修改密码成功'
      }
    }
    catch(e){
      ctx.body = {
        code:10000,
        message:'网络出错'+e
      }
    }
}

//登录
exports.login = async function login (ctx){
    const obj = ctx.request.body;
    try{
      //看该账号是否已经注册
      var accountRole = ""
      var accountSigned = false
      for (var role in models){
        signed = await models[role].findOne({
            where: {
              '$or':[
                {ID:obj.username || ''},
                {phoneNumber:obj.mobile || ''},
              ]
            }
        })
        if(signed){
            accountRole = role
            accountSigned = signed
            break
        }
      }
      //如果不存在
      if(!accountSigned){
        ctx.body = {
          status:401,
          message:'该账号还没注册，请联系管理员注册'
        }
        // return
      }
      //已经存在
      else{
          //密码不对
          if(accountSigned.password!==obj.password){
            if (obj.realCaptcha == obj.captcha) {
              // 验证码正确
              const token = jwt.sign(accountSigned.ID,'chambers');
              userInfo = {
                id:accountSigned.ID,
                token:token,
                roleId:accountRole,
                name:accountSigned.name,
                password:accountSigned.password,
                telephone:accountSigned.phoneNumber,
                status: 1,
                welcome: '欢迎',
                avatar: accountSigned.facePic || 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
                lang: 'zh-CN'
              }
              ctx.body = builder(userInfo, "", 200)
            } else {
              // 密码不对 验证码也不对
              ctx.body = {
                status:401,
                roleId:accountRole,
                message:'密码或验证码不正确'
              }
            }
          }
          //密码正确
          else{
            const token = jwt.sign(accountSigned.ID,'chambers');
            userInfo = {
              id:accountSigned.ID,
              token:token,
              roleId:accountRole,
              name:accountSigned.name,
              password:accountSigned.password,
              telephone:accountSigned.phoneNumber,
              status: 1,
              welcome: '欢迎',
              avatar: accountSigned.facePic || 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
              lang: 'zh-CN'
            }
            ctx.body = builder(userInfo, "", 200)
          }
      }
    }
    catch(e){
      ctx.body = {
        status:401,
        code:10000,
        message:'网络出错'+e
      }
    }
}

// 记录浏览记录
exports.addClick = async (ctx)=>{
	const Obj = ctx.request.body
	const stuID = jwt.decode(ctx.request.header['access-token']);
	// const stuID = jwt.decode(Obj.token);
	const actID = Obj.actID; 
	try{
    newID = await clickModel.max('ID')
    newID = Math.max(newID+1, 20000)
		await clickModel.create({ID:newID, stuID:stuID, actID:actID})
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

// 查参加和浏览记录
async function getMatrix(score_click, score_enroll, score_quality){
  data_enroll = {}
  data_click = {}
  data_quality = {}
  // 找出所有的活动
  actIDs_r = await activityModel.findAll({
    attributes: ['ID'],
    group:'ID',
    raw: true
  })
  actIDs = []
  for(i=0;i<actIDs_r.length;i++){
    actIDs.push(actIDs_r[i].ID)
  }
  // 找出所有的学生
  stuIDs_r = await studentModel.findAll({
    attributes: ['ID'],
    group:'ID',
    raw: true
  })
  stuIDs = []
  for(i=0;i<stuIDs_r.length;i++){
    stuIDs.push(stuIDs_r[i].ID)
  }
  for(i=0;i<stuIDs.length;i++){
    // 找出所有的学生参加活动的次数与评分
    res_enroll = await enrollModel.findAll({
      attributes: ['actID', [Sequelize.fn('COUNT', Sequelize.col('actID')), 'enroll_num'],
                   [Sequelize.fn('AVG', Sequelize.col('quality')), 'avg_quality']],
      where:{stuID:stuIDs[i], signIN:1, signOUT:1},
      group:'actID',
      raw: true
    })
    // '30001': [{'actID': 50001, 'click_num': 1}, {'actID': 50002, 'click_num': 1}]
    rest_enroll = {}
    rest_quality = {}
    for(j=0;j<res_enroll.length;j++){
      rest_enroll[String(res_enroll[j].actID)] = res_enroll[j].enroll_num
      rest_quality[String(res_enroll[j].actID)] = res_enroll[j].avg_quality / 5
    }
    data_enroll[stuIDs[i]] = rest_enroll
    data_quality[stuIDs[i]] = rest_quality
    // {'30001': {'50001': 1, '50002': 1}, '30002': {'50001': 2}}
    
    // 找出所有的学生浏览活动的次数
    res_click = await clickModel.findAll({
      attributes: ['actID', [Sequelize.fn('COUNT', Sequelize.col('actID')), 'click_num']],
      where:{stuID:stuIDs[i]},
      group:'actID',
      raw: true
    })
    // '30001': [{'actID': 50001, 'click_num': 1}, {'actID': 50002, 'click_num': 1}]
    // 格式处理
    rest_click = {}
    for(j=0;j<res_click.length;j++){
      rest_click[String(res_click[j].actID)] = res_click[j].click_num
    }
    data_click[stuIDs[i]] = rest_click
    // {'30001': {'50001': 1, '50002': 1}, '30002': {'50001': 2}}
  }
  // 创建一个矩阵，其中行是用户，列是项目。
  matrix = []
  for(i=0;i<stuIDs.length;i++){
    lines = []
    for(j=0;j<actIDs.length;j++){
      lines.push(0)
    }
    matrix.push(lines)
    // 这里不能重复push相同的lines，因为会导致内存不变！
  }
  // 遍历每个数据
  for(stu in data_enroll){
    stuInd = stuIDs.findIndex((x)=>x==stu)
    for(act in data_enroll[stu]){
      actInd = actIDs.findIndex((x)=>x==act)
      matrix[stuInd][actInd] += data_enroll[stu][act] * score_enroll
    }
  }
  for(stu in data_click){
    stuInd = stuIDs.findIndex((x)=>x==stu)
    for(act in data_click[stu]){
      actInd = actIDs.findIndex((x)=>x==act)
      matrix[stuInd][actInd] += data_click[stu][act] * score_click
    }
  }
  for(stu in data_quality){
    stuInd = stuIDs.findIndex((x)=>x==stu)
    for(act in data_quality[stu]){
      actInd = actIDs.findIndex((x)=>x==act)
      matrix[stuInd][actInd] += data_quality[stu][act] * score_quality
    }
  }
  return {actIDs:actIDs, stuIDs:stuIDs, clickTimes:data_click, enrollTimes:data_enroll, matrix:matrix}
}

// 查参加和浏览记录
exports.getMatrix = async (ctx)=>{
  const Obj = ctx.query
  const score_click = 3
  const score_enroll = 5
  const score_quality = 4
	try{
		data = await getMatrix(score_click, score_enroll, score_quality)
		ctx.body = {
			code:1,
			data:data}
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

// 协同过滤推荐算法的应用 https://github.com/sbyrnes/likely.js
async function calculateRecommendation(stuID){
    const score_click = 3
    const score_enroll = 4
    const score_quality = 5
    var data = await getMatrix(score_click, score_enroll, score_quality)
    var Recommender = require('likely');
    var Model = Recommender.buildModel(data.matrix, data.stuIDs, data.actIDs);
    // var recommendations = Model.recommendations(String(stuID));//检索用户尚未评分的所有项目的列表，使用标签按估计评分排序
    var recommendations = Model.rankAllItems(String(stuID));//使用标签检索所有项目的列表，按给定用户的评分（估计的和实际的）排序
    recommendations = recommendations.sort((a,b)=>{return b[1]-a[1]}) // 按得分排序
    res = []
    for (const i in recommendations){
      res.push(recommendations[i][0])
    }
    return recommendations
}

// 查参加和浏览记录
exports.getRecommendation = async (ctx)=>{
  const Obj = ctx.query
	const stuID = jwt.decode(ctx.request.header['access-token']);
	try{
		r = await calculateRecommendation(stuID)
		ctx.body = {
			code:1,
			data:r}
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

// role
const roleObj = {
    id: 'admin',
    name: '管理员',
    describe: '拥有所有权限',
    status: 1,
    creatorId: 'system',
    createTime: 1497160610259,
    deleted: 0,
    permissions: [
      {
        roleId: 'admin',
        permissionId: 'dashboard',
        permissionName: '仪表盘',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'exception',
        permissionName: '异常页面权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'result',
        permissionName: '结果权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'profile',
        permissionName: '详细页权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '表格权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'form',
        permissionName: '表单权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'order',
        permissionName: '订单管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'permission',
        permissionName: '权限管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'role',
        permissionName: '角色管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '桌子管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'user',
        permissionName: '用户管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          },
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      }
    ]
}

roleObj.permissions.push({
    roleId: 'admin',
    permissionId: 'support',
    permissionName: '超级模块',
    actions:
      '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
    actionEntitySet: [
      {
        action: 'add',
        describe: '新增',
        defaultCheck: false
      },
      {
        action: 'import',
        describe: '导入',
        defaultCheck: false
      },
      {
        action: 'get',
        describe: '详情',
        defaultCheck: false
      },
      {
        action: 'update',
        describe: '修改',
        defaultCheck: false
      },
      {
        action: 'delete',
        describe: '删除',
        defaultCheck: false
      },
      {
        action: 'export',
        describe: '导出',
        defaultCheck: false
      }
    ],
    actionList: null,
    dataAccess: null
})

// 按前端格式返回用户信息
exports.getUserInfo = async (ctx)=>{
  const Obj = ctx.query
  const ID = jwt.decode(Obj.token);
  const userInfo_r = await findRole(ID)
	try{
    const userInfo = {
      id: userInfo_r.accountSigned.ID,
      name: userInfo_r.accountSigned.name,
      avatar: '/avatar2.jpg',
      status: 1,
      roleId: userInfo_r.role,
      role: roleObj,
      telephone: userInfo_r.accountSigned.phoneNumber
    }
		ctx.body = builder(userInfo)
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

/**
 * 使用 用户登录的 token 获取用户有权限的菜单
 * 返回结构必须按照这个结构体形式处理，或根据
 * /src/router/generator-routers.js  文件的菜单结构处理函数对应即可
 * @param {*} role
 * @returns
 */
// 这里是根据用户返回能够查看到的路由
const userNav = role => {
  var nav = [
    // list
    {
      name: 'users',
      parentId: 0,
      id: 11010,
      meta: {
        icon: 'table',
        title: '用户管理',
        show: true
      },
      redirect: '/list/table-list',
      component: 'RouteView'
    },
    {
      name: 'users-list',
      parentId: 11010,
      id: 10011,
      path: '/list/table-list',
      meta: {
        title: '用户列表',
        show: true
      },
      component: 'TableList'
    },
    // dashboard
    {
      name: 'dashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '仪表盘',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'workplace',
      parentId: 1,
      id: 7,
      meta: {
        title: '工作台',
        show: true
      },
      component: 'Workplace'
    },
    {
      name: 'monitor',
      path: 'https://www.baidu.com/',
      parentId: 1,
      id: 3,
      meta: {
        title: '监控页（外部）',
        target: '_blank',
        show: true
      }
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 2,
      meta: {
        title: '分析页',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },

    // form
    {
      name: 'form',
      parentId: 0,
      id: 10,
      meta: {
        icon: 'form',
        title: '表单页'
      },
      redirect: '/form/base-form',
      component: 'RouteView'
    },
    {
      name: 'basic-form',
      parentId: 10,
      id: 6,
      meta: {
        title: '基础表单'
      },
      component: 'BasicForm'
    },
    {
      name: 'step-form',
      parentId: 10,
      id: 5,
      meta: {
        title: '分步表单'
      },
      component: 'StepForm'
    },
    {
      name: 'advanced-form',
      parentId: 10,
      id: 4,
      meta: {
        title: '高级表单'
      },
      component: 'AdvanceForm'
    },

    // list
    {
      name: 'list',
      parentId: 0,
      id: 10010,
      meta: {
        icon: 'table',
        title: '列表页',
        show: true
      },
      redirect: '/list/table-list',
      component: 'RouteView'
    },
    {
      name: 'table-list',
      parentId: 10010,
      id: 10011,
      path: '/list/table-list/:pageNo([1-9]\\d*)?',
      meta: {
        title: '查询表格',
        show: true
      },
      component: 'TableList'
    },
    {
      name: 'basic-list',
      parentId: 10010,
      id: 10012,
      meta: {
        title: '标准列表',
        show: true
      },
      component: 'StandardList'
    },
    {
      name: 'card',
      parentId: 10010,
      id: 10013,
      meta: {
        title: '卡片列表',
        show: true
      },
      component: 'CardList'
    },
    {
      name: 'search',
      parentId: 10010,
      id: 10014,
      meta: {
        title: '搜索列表',
        show: true
      },
      redirect: '/list/search/article',
      component: 'SearchLayout'
    },
    {
      name: 'article',
      parentId: 10014,
      id: 10015,
      meta: {
        title: '搜索列表（文章）',
        show: true
      },
      component: 'SearchArticles'
    },
    {
      name: 'project',
      parentId: 10014,
      id: 10016,
      meta: {
        title: '搜索列表（项目）',
        show: true
      },
      component: 'SearchProjects'
    },
    {
      name: 'application',
      parentId: 10014,
      id: 10017,
      meta: {
        title: '搜索列表（应用）',
        show: true
      },
      component: 'SearchApplications'
    },

    // profile
    {
      name: 'profile',
      parentId: 0,
      id: 10018,
      meta: {
        title: '详情页',
        icon: 'profile',
        show: true
      },
      redirect: '/profile/basic',
      component: 'RouteView'
    },
    {
      name: 'basic',
      parentId: 10018,
      id: 10019,
      meta: {
        title: '基础详情页',
        show: true
      },
      component: 'ProfileBasic'
    },
    {
      name: 'advanced',
      parentId: 10018,
      id: 10020,
      meta: {
        title: '高级详情页',
        show: true
      },
      component: 'ProfileAdvanced'
    },

    // result
    {
      name: 'result',
      parentId: 0,
      id: 10021,
      meta: {
        title: '结果页',
        icon: 'check-circle-o',
        show: true
      },
      redirect: '/result/success',
      component: 'PageView'
    },
    {
      name: 'success',
      parentId: 10021,
      id: 10022,
      meta: {
        title: '成功',
        hiddenHeaderContent: true,
        show: true
      },
      component: 'ResultSuccess'
    },
    {
      name: 'fail',
      parentId: 10021,
      id: 10023,
      meta: {
        title: '失败',
        hiddenHeaderContent: true,
        show: true
      },
      component: 'ResultFail'
    },

    // Exception
    {
      name: 'exception',
      parentId: 0,
      id: 10024,
      meta: {
        title: '异常页',
        icon: 'warning',
        show: true
      },
      redirect: '/exception/403',
      component: 'RouteView'
    },
    {
      name: '403',
      parentId: 10024,
      id: 10025,
      meta: {
        title: '403',
        show: true
      },
      component: 'Exception403'
    },
    {
      name: '404',
      parentId: 10024,
      id: 10026,
      meta: {
        title: '404',
        show: true
      },
      component: 'Exception404'
    },
    {
      name: '500',
      parentId: 10024,
      id: 10027,
      meta: {
        title: '500',
        show: true
      },
      component: 'Exception500'
    },

    // account
    {
      name: 'account',
      parentId: 0,
      id: 10028,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/center',
      component: 'RouteView'
    },
    {
      name: 'center',
      parentId: 10028,
      id: 10029,
      meta: {
        title: '个人中心',
        show: true
      },
      component: 'AccountCenter'
    },
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 10028,
      id: 10030,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/basic',
      component: 'AccountSettings'
    },
    {
      name: 'BasicSettings',
      path: '/account/settings/basic',
      parentId: 10030,
      id: 10031,
      meta: {
        title: '基本设置',
        show: false
      },
      component: 'BasicSetting'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 10030,
      id: 10032,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 10030,
      id: 10033,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    },
    {
      name: 'BindingSettings',
      path: '/account/settings/binding',
      parentId: 10030,
      id: 10034,
      meta: {
        title: '账户绑定',
        show: false
      },
      component: 'BindingSettings'
    },
    {
      name: 'NotificationSettings',
      path: '/account/settings/notification',
      parentId: 10030,
      id: 10035,
      meta: {
        title: '新消息通知',
        show: false
      },
      component: 'NotificationSettings'
    },
    
    {
      name: 'otherPage',
      parentId: 0,
      id: 10036,
      meta: {
        title: '其他组件',
        icon: 'slack',
        show: true
      },
      component: 'PageView'
    },{
      name: 'PermissionList',
      path: '/other/list/permission-list',
      parentId: 10036,
      id: 10037,
      meta: {
        title: '权限列表',
        show: true
      },
      component: 'PermissionList'
    },{
      name: 'TreeList',
      path: '/other/list/tree-list',
      parentId: 10036,
      id: 10038,
      meta: {
        title: '树目录表格',
        show: true
      },
      component: 'TreeList'
    },
    // 活动页面
    {
      name: 'actPage',
      parentId: 0,
      id: 10039,
      meta: {
        title: '反馈',
        icon: 'slack',
        show: true
      },
      component: 'RouteView',
      redirect: '/actPage/activitystu-list',
    },{
      name: 'ActivityList',
      path: '/actPage/activity-list',
      parentId: 10039,
      id: 10040,
      meta: {
        title: '活动列表',
        show: true
      },
      component: 'ActivityList'
    },{
      name: 'ActivityStuList',
      path: '/actPage/activitystu-list',
      parentId: 10039,
      id: 10040,
      meta: {
        title: '学生活动列表',
        show: true
      },
      component: 'ActivityStuList'
    }
  ]
  var adminNav =[
    // dashboard
    {
      name: 'dashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '数据展示',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 2,
      meta: {
        title: '数据大屏',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },
    {
      name: 'achievement',
      path: 'http://localhost:5000/',
      parentId: 1,
      id: 3,
      meta: {
        title: '数据大屏(外链)',
        target: '_blank',
        show: true
      }
    },
    // list
    {
      name: 'users',
      parentId: 0,
      id: 11010,
      meta: {
        icon: 'table',
        title: '管理员权限',
        show: true
      },
      redirect: '/list/table-list',
      component: 'RouteView'
    },
    {
      name: 'users-list',
      parentId: 11010,
      id: 10011,
      path: '/list/table-list',
      meta: {
        title: '用户列表',
        show: true
      },
      component: 'TableList'
    },
    {
      name: 'PermissionList',
      path: '/list/permission-list',
      parentId: 11010,
      id: 10037,
      meta: {
        title: '模型选择',
        show: true
      },
      component: 'PermissionList'
    },
    // // 审核
    // {
    //   name: 'audit',
    //   parentId: 0,
    //   id: 12010,
    //   meta: {
    //     icon: 'table',
    //     title: '反馈',
    //     show: true
    //   },
    //   component: 'RouteView'
    // },
    {
      name: 'basic-list',
      parentId: 11010,
      id: 12011,
      meta: {
        title: '用户反馈',
        show: true
      },
      component: 'StandardList'
    },
    // account
    {
      name: 'account',
      parentId: 0,
      id: 10028,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/center',
      component: 'RouteView'
    },
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 10028,
      id: 10030,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/security',
      component: 'AccountSettings'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 10030,
      id: 10032,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 10030,
      id: 10033,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    }
  ]
  var teaNav =[
    // dashboard
    {
      name: 'dashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '数据展示',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 2,
      meta: {
        title: '数据大屏',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },
    // {
    //   name: 'achievement',
    //   parentId: 1,
    //   id: 10016,
    //   meta: {
    //     title: '成果展示',
    //     show: true
    //   },
    //   component: 'SearchProjects'
    // },
    // 审核
    {
      name: 'audit',
      parentId: 0,
      id: 12010,
      meta: {
        icon: 'table',
        title: '反馈',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'basic-list',
      parentId: 12010,
      id: 12011,
      meta: {
        title: '用户反馈',
        show: true
      },
      component: 'StandardList'
    },
    // list
    {
      name: 'users',
      parentId: 0,
      id: 11010,
      meta: {
        icon: 'table',
        title: '用户管理',
        show: true
      },
      redirect: '/list/table-list',
      component: 'RouteView'
    },
    {
      name: 'users-list',
      parentId: 11010,
      id: 10011,
      path: '/list/table-list',
      meta: {
        title: '用户列表',
        show: true
      },
      component: 'TableList'
    },
    // account
    {
      name: 'account',
      parentId: 0,
      id: 10028,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/settings/security',
      component: 'RouteView'
    },
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 10028,
      id: 10030,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/security',
      component: 'AccountSettings'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 10030,
      id: 10032,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 10030,
      id: 10033,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    },
    // profile
    {
      name: 'profile',
      parentId: 0,
      id: 10018,
      meta: {
        title: '详情页',
        icon: 'profile',
        show: false
      },
      redirect: '/profile/basic',
      component: 'RouteView'
    },
    {
      name: 'basic',
      parentId: 10018,
      id: 10019,
      meta: {
        title: '活动详情页',
        show: false
      },
      component: 'ProfileBasic'
    }
  ]
  var stuNav = [
    // dashboard
    {
      name: 'dashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '数据展示',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 2,
      meta: {
        title: '数据大屏',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },
    // {
    //   name: 'achievement',
    //   parentId: 1,
    //   id: 10016,
    //   meta: {
    //     title: '成果展示',
    //     show: true
    //   },
    //   component: 'SearchProjects'
    // },
    // 活动页面
    {
      name: 'actPage',
      parentId: 0,
      id: 10039,
      meta: {
        title: '社团活动',
        icon: 'slack',
        show: true
      },
      component: 'RouteView',
      redirect: '/actPage/activitystu-list',
    },{
      name: 'ActivityStuList',
      path: '/actPage/activitystu-list',
      parentId: 10039,
      id: 10040,
      meta: {
        title: '学生活动列表',
        show: true
      },
      component: 'ActivityStuList'
    },
    // account
    {
      name: 'account',
      parentId: 0,
      id: 10028,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/center',
      component: 'RouteView'
    },
    {
      name: 'center',
      parentId: 10028,
      id: 10029,
      meta: {
        title: '个人中心',
        show: true
      },
      component: 'AccountCenter'
    },
    // profile
    {
      name: 'profile',
      parentId: 0,
      id: 10018,
      meta: {
        title: '详情页',
        icon: 'profile',
        show: false
      },
      redirect: '/profile/basic',
      component: 'RouteView'
    },
    {
      name: 'basic',
      parentId: 10018,
      id: 10019,
      meta: {
        title: '活动详情页',
        show: false
      },
      component: 'ProfileBasic'
    },
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 10028,
      id: 10030,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/security',
      component: 'AccountSettings'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 10030,
      id: 10032,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 10030,
      id: 10033,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    }
  ]
  var clubNav = [
    // dashboard
    {
      name: 'dashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '数据展示',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 2,
      meta: {
        title: '数据大屏',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },
    // {
    //   name: 'achievement',
    //   parentId: 1,
    //   id: 10016,
    //   meta: {
    //     title: '成果展示',
    //     show: true
    //   },
    //   component: 'SearchProjects'
    // },
    // 活动页面
    {
      name: 'actPage',
      parentId: 0,
      id: 10039,
      meta: {
        title: '用户权限',
        icon: 'slack',
        show: true
      },
      component: 'RouteView',
      redirect: '/actPage/activity-list',
    },{
      name: 'DetectionList',
      path: '/actPage/Detection-List',
      parentId: 10039,
      id: 10041,
      meta: {
        title: '检测',
        show: true
      },
      component: 'DetectionList'
    },{
      name: 'ActivityList',
      path: '/actPage/activity-list',
      parentId: 10039,
      id: 10040,
      meta: {
        title: '用户反馈',
        show: true
      },
      component: 'ActivityList'
    },
    // account
    {
      name: 'account',
      parentId: 0,
      id: 10028,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/center',
      component: 'RouteView'
    },
    // profile
    {
      name: 'profile',
      parentId: 0,
      id: 10018,
      meta: {
        title: '签到签退',
        icon: 'profile',
        show: false
      },
      redirect: '/profile/basic',
      component: 'RouteView'
    },
    {
      name: 'basic',
      parentId: 10018,
      id: 10019,
      meta: {
        title: '详情页',
        show: false
      },
      component: 'ProfileBasic'
    },
    
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 10028,
      id: 10030,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/security',
      component: 'AccountSettings'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 10030,
      id: 10032,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 10030,
      id: 10033,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    }
  ]
  switch(role){
    case 'admin':
      nav = adminNav;
      break;
    case 'teacher':
      // nav = nav
      nav = teaNav
      break;
    case 'club':
      nav = clubNav
      break;
    case 'student':
      nav = stuNav
      break;
    default:
      nav = nav
  }
  const json = builder(nav)
  return json
}

exports.getUserNav = async (ctx)=>{
  const Obj = ctx.query
  const ID = jwt.decode(ctx.request.header['access-token']);
  const userInfo_r = await findRole(ID)
	try{
		ctx.body = userNav(userInfo_r.role)
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

// 为大屏统计数据
exports.getAnalysis = async (ctx)=>{
  const Obj = ctx.query
  // const ID = jwt.decode(ctx.request.header['access-token']);
	try{
    const res = {}
    res.actNum = await activityModel.count({where: {auditStatus: 1}})
    res.enrollNum = await enrollModel.count()
    res.achNum = await achievementModel.count({where: {status: 1}})
    res.clickNum = await clickModel.count()

    res.achNumPremon = {}
    const achNumPremon = await achievementModel.count({where: {status: 1}, group: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('time'), '%Y%m')]], raw: true})
    for (i in achNumPremon){
      res.achNumPremon[achNumPremon[i]["DATE_FORMAT(`time`, '%Y%m')"]] = achNumPremon[i].count
    }

    res.enrollNumPremon = {}
    const enrollNumPremon = await enrollModel.count({where: {signIN: 1, signOUT: 1}, group: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('enrollTime'), '%Y%m')]], raw: true})
    for (i in enrollNumPremon){
      res.enrollNumPremon[enrollNumPremon[i]["DATE_FORMAT(`enrollTime`, '%Y%m')"]] = enrollNumPremon[i].count
    }

    res.enrollStuNumPremon = {}
    const enrollStuNumPremon = await enrollModel.findAndCountAll({where: {signIN: 1, signOUT: 1}, group: ['stuID'], raw: true,
      include:[{
          attributes:['name'],
          association: enrollModel.hasOne(studentModel, {foreignKey:'ID', sourceKey:'stuID', required: true})
        }
      ]
    })
    // console.log(enrollStuNumPremon)
    for (i in enrollStuNumPremon.count){
      res.enrollStuNumPremon[enrollStuNumPremon.rows.find(v => v.stuID === enrollStuNumPremon.count[i].stuID)['student.name']] = enrollStuNumPremon.count[i].count
    }
    
    res.achNumPerclub = {}
    const achNumPerclub = await activityModel.findAll({
      attributes:['clubID', [Sequelize.fn('COUNT', Sequelize.col('achievement.ID')), 'achNum']],
      where: {auditStatus: 1}, raw: true, group: 'clubID',
      include:[{
          association: activityModel.hasOne(achievementModel, {foreignKey:'actID', sourceKey:'ID', required: true})
        },{
          association: activityModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'clubID', required: true})
        }
      ]
    })
    for (i in achNumPerclub){
      res.achNumPerclub[achNumPerclub[i]["club.name"]] = achNumPerclub[i].achNum
    }
    
    res.achCE = []
    const achC = await activityModel.findAll({
      attributes: ['ID', 'name', [Sequelize.fn('COUNT', Sequelize.col('clicks.ID')), 'clickNum']],
      where: {auditStatus: 1}, raw: true, group: ['activity.ID'],
      include:[{
          attributes:[],
          association: activityModel.hasMany(clickModel, {foreignKey:'actID', sourceKey:'ID', required: true}),
          required: false,
          model:clickModel,
        }
      ]
    })
    const achE = await activityModel.findAll({
      attributes: ['ID', 'name', [Sequelize.fn('COUNT', 'enrolls.ID'), 'enrollNum']],
      where: {auditStatus: 1}, raw: true, group: ['activity.ID'],
      include:[{
          // attributes:[[Sequelize.fn('COUNT', Sequelize.col('enrollTime')), 'enrollNum']],
          attributes:[],
          association: activityModel.hasMany(enrollModel, {foreignKey:'actID', sourceKey:'ID', required: true}),
          required: false,
          model:enrollModel,
          // where:{signIN:1, signOUT:1}
        }
      ]
    })
    for (i in achC){
      res.achCE.push({ID:achC[i].ID, name:achC[i].name, clickNum:achC[i].clickNum ,enrollNum:achE[i].enrollNum})
    }
    res.achCE.sort((a,b) => a.clickNum+a.enrollNum*2>b.clickNum+b.enrollNum*2)
    for (i in res.achCE){
      res.achCE[i]['index'] = Number(i)+1
    }
    
    // const collAct = await enrollModel.findAll({
    //   attributes: ['student.collegeID', [Sequelize.fn('COUNT', 'enrolls.ID'), 'Num']],
    //   raw: true, group: ['student.collegeID'],
    //   include:[{
    //       attributes:[],
    //       association: enrollModel.hasOne(studentModel, {foreignKey:'ID', sourceKey:'stuID', required: true}),
    //       required: false,
    //     }
    //   ]
    // })
    res.collAct = await studentModel.findAll({
      attributes: ['college.name', [Sequelize.fn('COUNT', 'enrolls.ID'), 'count']],
      raw: true, group: ['college.ID'],
      include:[{
          attributes:[],
          association: studentModel.hasOne(enrollModel, {foreignKey:'stuID', sourceKey:'ID', required: true}),
          required: false,
        },{
          attributes:[],
          association: studentModel.hasOne(collegeModel, {foreignKey:'ID', sourceKey:'collegeID', required: true}),
          required: false,
        }
      ]
    })

    // console.log(res)
		ctx.body = {
			code:0,
			message:'',
      data: res
		}
	}catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
		console.log(e)
	}
}

//查询所有成果
exports.searchAchievement = async (ctx)=>{
  // const Obj = ctx.query
  try{
    const activities = await activityModel.findAll({
      attributes:['name'],
      include:[{
          attributes:[['name', 'clubName']],
          association: activityModel.hasOne(clubModel, {foreignKey:'ID', sourceKey:'clubID', required: true})
        },{
          attributes:['name', 'info', 'level', 'file', 'time'],
          association: activityModel.hasMany(achievementModel, {foreignKey:'actID', sourceKey:'ID', required: true}),
          required: true,
          where:{status:1}
        }
      ],
      raw:true
    });
    // console.log(activities)
    ctx.body = {
      code:0,
      data:activities
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