const router = require('koa-router')();
const club = require('../controllers/club');


// 申请活动
router.post('/api/club/addActivity', club.addActivity);
router.post('/api/club/removeActivity', club.removeActivity);

// 修改活动
router.post('/api/club/updateActivity', club.updateActivity);

// 搜索本社团的活动
router.get('/api/club/searchActivity', club.searchActivity);

// 新增活动分数
router.post('/api/club/addScore', club.addScore);
router.post('/api/club/removeScore', club.removeScore);

// 签到签退
router.post('/api/club/sign', club.sign);

// 获得某个活动的分数
router.get('/api/club/searchScore', club.searchScore);

// 新增成果
router.post('/api/club/addAchievement', club.addAchievement);

// 查看活动评分
router.get('/api/club/searchQuality', club.searchQuality);

// 新增检测
router.post('/api/addDetection', club.addDetection);

// 搜索本社团的活动
router.get('/api/searchDetection', club.searchDetection);
//搜索当前用户的检索记录
router.get('/api/searchmyDetection', club.searchmyDetection)

// 新增检测
router.post('/api/addFeedback', club.addFeedback);

router.get('/api/searchFeedback', club.searchFeedback);

router.post('/api/auditFeedback', club.auditFeedback);

module.exports = router;