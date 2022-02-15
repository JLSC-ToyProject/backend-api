/**
 * @file examKakaoLogin.js
 * @notice Kakao 로그인 예제 코드
 * @author shjang
 */

const Init = require('../api/login/loginKakao.js').Init;
const getOption = require('../api/login/loginKakao.js').getOption;
const getKakaoAccessToken = require('../api/login/loginKakao.js').getKakaoAccessToken;
const getKakaoUserInfo = require('../api/login/loginKakao.js').getKakaoUserInfo;

const RunProc = async () => {
    try {
        if(process.argv.length < 3) {
            throw new Error("Invalid Parameters!");
        }
        const code = process.argv[2];
        const options = getOption('kakao', code);
        const token = await getKakaoAccessToken(options);
        /** 
         * @notice token 결과 값 예상 모습
         * access_token: 'tgE2lJnxp3qjFp-03L8OLQ6ilBjmI0FlHm45CQorDKgAAAF--PZzYQ',
         * token_type: 'bearer',
         * refresh_token: 'Gu4pRpGCdxKkXeNNfXbSIUSMjcvB3Z4O-rTPvworDKgAAAF--PZzYA',
         * expires_in: 21599,
         * scope: 'profile_nickname',
         * refresh_token_expires_in: 5183999
         */
        console.log("RunProc::token", token);
        const userInfo = await getKakaoUserInfo(options.userInfoUrl, token.access_token);
        /**
         * @notice userInfo 결과 값 예상 모습
         * id: 2120390969,
         * connected_at: '2022-02-14T15:55:35Z',
         * properties: { nickname: '석희' },
         * kakao_account: {
         *   profile_nickname_needs_agreement: false,
         *   profile: { nickname: '석희' }
         * }
         */
        console.log("RunProc::userInfo", userInfo);

    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();