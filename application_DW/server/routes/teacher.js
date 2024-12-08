const router = require('koa-router')();
const teacher = require('../controllers/teacher');

// 搜索活动
router.get('/api/teacher/searchActivity', teacher.searchActivity);

// 审核活动
router.post('/api/teacher/auditActivity', teacher.auditActivity);

// 审核成果
router.post('/api/teacher/auditAchievement', teacher.auditAchievement);

// 审核申诉
router.post('/api/teacher/auditComplaint', teacher.auditComplaint);

// 搜索搜索
router.get('/api/teacher/searchComplaint', teacher.searchComplaint);

module.exports = router;