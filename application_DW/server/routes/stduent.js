const router = require('koa-router')();
const student = require('../controllers/student');

// 查询可见活动，该学生的学院可见且已通过审核，并已经公开
router.get('/api/student/searchActivity', student.searchActivity);

// 获得某个学生的总分
router.get('/api/student/searchScore', student.searchScore);

//报名活动，有名额且已经审核求学院允许且在报名时间内
router.post('/api/student/enrollActivity', student.enrollActivity);
router.post('/api/student/unenrollActivity', student.unenrollActivity);

// 上传照片
router.post('/api/student/uploadFacepic', student.uploadFacepic);

// 活动评分
router.post('/api/student/ratingActivity', student.ratingActivity);

// 活动申诉
router.post('/api/student/complaintActivity', student.complaintActivity);

// 搜索申诉
router.get('/api/student/searchComplaint', student.searchComplaint);


module.exports = router;