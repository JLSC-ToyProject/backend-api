/**
 * @file libDataProcessor.js
 * @notice 데이터 가공에 필요한 library 코드
 * @author shjang
 */

const xmlToJsonConvert = require('xml-js');

module.exports.xmlToJson = (xml) => {
    try {
        const result = xmlToJsonConvert.xml2json(xml, { compact: true, spaces: 4 });
        return JSON.parse(result);
    } catch (error) {
        console.log("libDataProcessor::xmlToJson::error", error);
    }
}
