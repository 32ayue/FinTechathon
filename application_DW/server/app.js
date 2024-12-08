const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const jwt = require('koa-jwt');
const cors = require('koa2-cors');

// const mall = require('./routes/mall');
// const user = require('./routes/user');
// const position = require('./routes/position');
// const users = require('./routes/users');
// const drivingrecord = require('./routes/drivingrecord');
// const alarmrecord = require('./routes/alarmrecord');
const admin = require('./routes/admin');
const stduent = require('./routes/stduent');
const club = require('./routes/club');
const files = require('./routes/files');
const user = require('./routes/user');
const teacher = require('./routes/teacher');


const KoaBody = require("koa-body");
 
// 使用文件上传中间件,外部能访问图片 导致Blob is not a constructor
app.use(KoaBody({
  multipart: true,
  formidable: {
    maxFileSize: 5000*1024*1024,
    multipart: true
  }}));
// const serve = require("koa-static");
// const path = require("path");
// app.use(serve(path.join(__dirname, "/public/upload")));

// error handler
onerror(app);

// middlewares
app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Token'],
}));
// 解决跨域
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
// 访问静态资源文件
app.use(require('koa-static')(__dirname + '/public',{index: "index.html"}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});


app.use(jwt({
	secret:'chambers'
}).unless({path:[/^\/api/]}));

// routes 动态路由
// app.use(mall.routes(), mall.allowedMethods());
// app.use(user.routes(), user.allowedMethods());
app.use(admin.routes(), admin.allowedMethods());
// app.use(position.routes(), position.allowedMethods());
// app.use(users.routes(), users.allowedMethods());
// app.use(drivingrecord.routes(), drivingrecord.allowedMethods());
// app.use(alarmrecord.routes(), alarmrecord.allowedMethods());
app.use(stduent.routes(), stduent.allowedMethods());
app.use(files.routes(), files.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(club.routes(), club.allowedMethods());
app.use(teacher.routes(), teacher.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
