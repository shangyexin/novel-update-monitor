const utils = {};
const crypto = require('crypto');

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

module.exports = utils;