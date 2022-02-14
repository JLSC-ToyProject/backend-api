/**
 * @file examKakaoLogin.js
 * @notice Kakao 로그인 예제 코드
 * @author shjang
 */

const Init = require('../api/login/loginKakao').Init;
const getKakaoAccessToken = require('../api/login/loginKakao').getKakaoAccessToken;

const RunProc = async () => {
    try {
        if(process.argv.length < 3) {
            throw new Error("Invalid Parameters!");
        }
        const code = process.argv[2];
        const result = await getKakaoAccessToken(code);
        
        /** 
         * @notice 결과 값 예상 모습
         * access_token: 'tgE2lJnxp3qjFp-03L8OLQ6ilBjmI0FlHm45CQorDKgAAAF--PZzYQ',
         * token_type: 'bearer',
         * refresh_token: 'Gu4pRpGCdxKkXeNNfXbSIUSMjcvB3Z4O-rTPvworDKgAAAF--PZzYA',
         * expires_in: 21599,
         * scope: 'profile_nickname',
         * refresh_token_expires_in: 5183999
         */
        console.log("RunProc::result", result);
    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();