/**
 * @file examOpenAPI.js
 * @notice 공공데이터 OpenAPI 샘플 예제 코드
 * @author shjang
 */

const path = require('path');
const request = require('request');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const xmlToJson = require('../libs/libDataProcessor.js').xmlToJson;

const openApiUrl = process.env.OPEN_API_SERVICE_URL;
const apiKeyEncoding = process.env.OPEN_API_KEY_ENCODING;
const apiKeyDecoding = process.env.OPEN_API_KEY_DECODING;

let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKeyEncoding; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent('11110'); /* */
queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent('201512'); /* */

const sendRequest = async () => {
    try {
        request({
            url: openApiUrl + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            console.log('Status', response.statusCode);
            console.log('Headers', JSON.stringify(response.headers));
            
            let data = xmlToJson(body);
            console.log('Reponse received', data);
            console.log('Reponse received total Count', data.response.body.totalCount._text);

        });
        return true;
    } catch(error) {
        console.log("sendRequest::error", error);
    }
}

const RunProc = async () => {
    try {
        const result = await sendRequest();
        console.log("RunProc::result", result);
    } catch(error) {
        console.log("RunProc::error", error);
    }
}
RunProc();