/**
 * @file examKakaoLogin.js
 * @notice Kakao 로그인 예제 코드
 * @author shjang
 */

const Init = require('../api/login/loginKakao').Init;


const RunProc = async () => {
    try {
        const result = Init();
        console.log("RunProc::result", result);
    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();