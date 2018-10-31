var express = require('express');
var router = express.Router();
const utils = require('../middleware/utils');

//校验微信服务器签名
router.use('/api/wechat/', utils.verifyWechatSign());

module.exports = router;
