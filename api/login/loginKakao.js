/**
 * @file loginKakao.js
 * @notice Kakao 로그인 API 호출 코드
 * @author shjang
 */

const request = require('request');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });


module.exports.Init = () => {
    try {
        const kakao = {
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_SECRET,
            redirectUri: process.env.KAKAO_REDIRECT_URL
        }
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientId}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
        request({
            url: kakaoAuthURL,
            method: 'GET'
        }, function (error, response, body) {
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            console.log('Reponse received', body);
        });
    } catch(error) {
        console.log("loginKakao::InitKakaoLogin::error", error);
    }
}

module.exports.kakaoLogin = () => {
    try {

    } catch(error) {
        console.log("loginKakao::kakaoLogin::error", error);
    }
}