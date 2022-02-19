const express = require('express');
const router = express.Router();
const getOption = require('../api/login/loginKakao.js').getOption;
const getKakaoAccessToken = require('../api/login/loginKakao.js').getKakaoAccessToken;
const getKakaoUserInfo = require('../api/login/loginKakao.js').getKakaoUserInfo;

/* GET login listing. */
router.get('/', function(req, res) {
    res.send(`respond with a login`);
});

router.post('/user/token', async (req, res) => {
    const coperation = req.body.coperation;
    const code = req.body.code;
    const options = getOption(coperation, code);
    let token = undefined;
    if (coperation === 'kakao') {
        token = await getKakaoAccessToken(options);
    }
    res.send(token);
});

router.post('/user/info', async (req, res) => {
    const coperation = req.body.coperation;
    const accessToken = req.body.token;
    let userInfo = undefined;
    if (coperation === 'kakao') {
        userInfo = await getKakaoUserInfo(null, accessToken);
    }
    res.send(userInfo);
});

module.exports = router;