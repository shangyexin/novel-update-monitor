var express = require('express');
var router = express.Router();
const utils = require('../middleware/utils');

//校验微信服务器签名
router.use('/api/wechat', utils.verifyWechatSign());

//接收小说更新推送通知
router.post('/api/novelupdate', utils.novelUpdate());

module.exports = router;
