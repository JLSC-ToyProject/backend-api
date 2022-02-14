/**
 * @file loginKakao.js
 * @notice Kakao 로그인 API 호출 코드
 * @author shjang
 */

const request = require('request');
const fetch = require('node-fetch');
const qs = require('qs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class Kakao {
    constructor(code) {
        this.url = process.env.KAKAO_TOKEN_URI;
        this.clientId = process.env.KAKAO_CLIENT_ID;
        this.clientSecret = process.env.KAKAO_SECRET_KEY;
        this.redirectUri = process.env.KAKAO_REDIRECT_URI;
        this.code = code;
    }
}

module.exports.Init = () => {
    try {
        const kakao = {
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_SECRET_KEY,
            redirectUri: process.env.KAKAO_REDIRECT_URI
        }
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientId}&redirect_uri=${kakao.redirectUri}&response_type=code`;
        request({
            url: kakaoAuthURL,
            method: 'GET'
        }, function (error, response, body) {
            //console.log('Status', response.statusCode);
            //console.log('Headers', JSON.stringify(response.headers));
            console.log('Reponse received', body);
        });
    } catch(error) {
        console.log("loginKakao::InitKakaoLogin::error", error);
    }
}

module.exports.getKakaoAccessToken = async (code) => {
    try {
        const kakao = new Kakao(code);
        const token = await getAccessToken(kakao);
        return token;
    } catch(error) {
        console.log("loginKakao::kakaoLogin::error", error);
    }
}

const getAccessToken = async (options) => {
    try {
        return await fetch(options.url, {
            method: 'POST',
            headers: {
                'content-type':'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: qs.stringify({
                grant_type: 'authorization_code', // 특정 스트링
                client_id: options.clientId,
                client_secret: options.clientSecret,
                redirectUri: options.redirectUri,
                code: options.code,
            }),
        }).then(res => res.json());
    } catch(error) {
        console.log("loginKakao::getAccessToken::error", error);
    }
};