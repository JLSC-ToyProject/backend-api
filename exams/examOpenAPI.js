/**
 * @file examOpenAPI.js
 * @notice 공공데이터 OpenAPI 샘플 예제 코드
 * @author shjang
 */

const path = require('path');
const request = require('request');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const openApiUrl = process.env.OPEN_API_SERVICE_URL;
const apiKeyEncoding = process.env.OPEN_API_KEY_ENCODING;
const apiKeyDecoding = process.env.OPEN_API_KEY_DECODING;

var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKeyEncoding; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent('11110'); /* */
queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent('201512'); /* */

let sendRequest = async () => {
    try {
        request({
            url: openApiUrl + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            console.log('Reponse received', body);
        });
    } catch(error) {
        console.log("sendRequest::error", error);
    }
}

let RunProc = async () => {
    try {
        const result = await sendRequest();
        console.log("RunProc::result", result);
    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();