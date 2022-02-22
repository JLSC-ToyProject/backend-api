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
        this.userInfoUrl = process.env.KAKAO_USERINFO_URI;
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

module.exports.getKakaoAccessToken = async (options) => {
    try {
        const token = await getAccessToken(options);
        return token;
    } catch(error) {
        console.log("loginKakao::getKakaoAccessToken::error", error);
    }
}

module.exports.checkKakaoAccessToken = async (url, accessToken) => {
    try {
        let userUrl = url;
        if (!userUrl) {
            userUrl = process.env.KAKAO_ACCESS_TOKEN_INFO;
        }
        console.log("checkKakaoAccessToken", userUrl, accessToken)
        const tokenInfo = await checkAccessToken(userUrl, accessToken);
        return tokenInfo;
    } catch(error) {
        console.log("loginKakao::checkKakaoAccessToken::error", error);
    }
}

module.exports.getKakaoUserInfo = async (url, accessToken) => {
    try {
        let userUrl = url;
        if (!userUrl) {
            userUrl = process.env.KAKAO_USERINFO_URI;
        }
        const userInfo = await getUserInfo(userUrl, accessToken);
        return userInfo;
    } catch(error) {
        console.log("loginKakao::getKakaoUserInfo::error", error);
    }
}

module.exports.getOption = (coperation, code) => {
    switch(coperation){
        case 'kakao':
            return new Kakao(code);
        case 'google':
            // return new Google(code);
        break;
        case 'naver':
            // return new Naver(code);
        break;
    }
}

const getAccessToken = async (options) => {
    try {
        return await fetch(options.url, {
            method: 'POST',
            headers: {
                'Content-type':'application/x-www-form-urlencoded;charset=utf-8'
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

const checkAccessToken = async (url, accessToken) => {
    try {
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json());
    } catch(error) {
        console.log("loginKakao::getUserInfo::error", error);
    }
};

const getUserInfo = async (url, accessToken) => {
    try {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json());
    } catch(error) {
        console.log("loginKakao::getUserInfo::error", error);
    }
};