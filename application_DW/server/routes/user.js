const router = require('koa-router')();
const user_utils = require('../controllers/user_utils');

// 登录
router.post('/api/login', user_utils.login);
router.get('/api/userInfo', user_utils.getUserInfo);
router.get('/api/UserNav', user_utils.getUserNav);

// 改密码
router.post('/api/changePwd', user_utils.changePwd);

// 浏览记录
router.post('/api/click', user_utils.addClick);

// 获取记录与推荐
router.get('/api/getMatrix', user_utils.getMatrix);
router.get('/api/getRecommendation', user_utils.getRecommendation);
router.get('/api/getAnalysis', user_utils.getAnalysis);
router.get('/api/searchAchievement', user_utils.searchAchievement);


module.exports = router;