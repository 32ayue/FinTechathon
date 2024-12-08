const router = require('koa-router')();
const userAdmin = require('../controllers/admin');



// //登录
// router.post('/api/admin/login', userAdmin.login);
// //修改密码
// router.post('/api/admin/changePwd', userAdmin.changePwd);

//查询所有用户
router.get('/api/admin/allStudent', userAdmin.getAllStudent);
router.get('/api/admin/allTeacher', userAdmin.getAllTeacher);
router.get('/api/admin/allCollege', userAdmin.getAllCollege);

//删除指定用户
router.get('/api/admin/deleteStudent', userAdmin.deleteStudent);
router.get('/api/admin/deleteTeacher', userAdmin.deleteTeacher);
router.post('/api/admin/deleteUser', userAdmin.deleteUser);

//搜索用户
router.get('/api/admin/searchStudent', userAdmin.searchStudent);
router.get('/api/admin/searchTeacher', userAdmin.searchTeacher);
router.get('/api/admin/searchAllUser', userAdmin.searchAllUser);

//新增用户
router.post('/api/admin/addTeacher', userAdmin.addTeacher);
router.post('/api/admin/addStudent', userAdmin.addStudent);
router.post('/api/admin/addClub', userAdmin.addClub);

// 批量新增用户
router.post('/api/admin/addUser', userAdmin.addUser);
router.post('/api/admin/updateTea', userAdmin.updateTea);

//更新学生人脸


//搜索模型
router.get('/api/admin/searchAllModels', userAdmin.searchAllModels);

//上传模型
router.post('/api/admin/addFileList', userAdmin.addFileList)

module.exports = router;