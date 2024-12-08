const router = require('koa-router')()
const fs = require('fs')
const path = require("path")
const www = require('../bin/www')


router.get('/api/fileExists',  async (ctx) => {
    const fname = ctx.query.fname //ctx.request.files.file.name
    let filePath = path.join(__dirname, '..', 'public/upload', fname);
    let url = path.join('localhost:'+String(www.port), 'upload', fname);
    console.log(filePath)
	try{
        if (fs.existsSync(filePath)){
            ctx.body = {
                code:1,
                message:"文件存在",
                url:url
            };
        } else {
            ctx.body = {
                code:0,
                message:"文件不存在"
            };
        }
    }
    catch(e){
        console.log(e);
        ctx.body={
            code:10000,
            message:'网络出错'
        }
    }
});

// 上传单个文件
router.post('/api/uploadfile', async (ctx, next) => {
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
});


module.exports = router