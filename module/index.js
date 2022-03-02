const convert = require('xml-js');


module.exports.xmlToJson = param => {
    var xmlToJsonVal = convert.xml2json(param, {compact: true, spaces: 4});
    return JSON.parse(xmlToJsonVal);
}

//년도 20xx 를받아 ['2020xx01'....] 로 돌려준다.
module.exports.makeMonthArr = year =>{
    
    let month = ['01','02','03','04','05','06','07','08','09','10','11','12']; 
    return month.map(v=>`${year}${v}`);
    
}
