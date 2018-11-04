const utils = {};
const crypto = require('crypto');
const request = require('request');
const notice = require('./notice')

const getTokenUlr = 'http://35.234.33.9/api/gettoken'
const baseNotifyUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='

utils.verifyWechatSign = function () {
    return function (req, res) {
        const token = 'VqmB965wOEBrPLNoMkHCfIOpxF0WWFM6';
        const {signature, timestamp, nonce, echostr} = req.query;
        if (!signature || !timestamp || !nonce) {
            return res.send('invalid request');
        }
        if (req.method === 'POST') {
            console.log('utils.verifyWechatSign.post:', {body: req.body, query: req.query});
        }

        if (req.method === 'GET') {
            console.log('utils.verifyWechatSign.get:', {get: req.body});
            if (!echostr) {
                return res.send('invalid request');
            }
        }

        /*排序*/
        const params = [token, timestamp, nonce];
        params.sort();

        /*sha1加密*/
        const hash = crypto.createHash('sha1');
        const sign = hash.update(params.join('')).digest('hex');

        /*对比*/
        if (signature == sign) {
            res.send(echostr);
        } else {
            res.send('invalid sign');
        }
    };
}

utils.notifyUser = function (url, data) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {"content-type": "application/json",},
        body: data
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    });
};

utils.novelUpdate = function () {
    return function (req, res) {
        request(getTokenUlr, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let accessToken = body;
                let compleNotifyUrl = baseNotifyUrl + accessToken;
                // console.log('compleNotifyUrl is %s', compleNotifyUrl);
                notice.data.novelName.value = req.body.bookName;
                notice.data.sectionName.value = req.body.latestChapter;
                notice.data.updateTime.value = req.body.updateTime;
                notice.url = req.body.latestUrl;
                console.log(notice);
                // 通知用户
                utils.notifyUser(compleNotifyUrl, notice);
            }
        })
        res.send('success');
    };
}


module.exports = utils;