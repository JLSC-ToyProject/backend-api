const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const mysql = require('mysql');  // mysql 모듈 로드
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
connection.connect();

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const xmlToJson = require('../libs/libDataProcessor.js').xmlToJson;

const aprtApiUrl = process.env.OPEN_API_APARTMENT_URL;
const codeApiUrl = process.env.OPEN_API_CODE_URL;
const apiKeyEncoding = process.env.OPEN_API_KEY_ENCODING;

const getApartment = async (page, cnt , lawd,  ymd) => {
    return new Promise((resolve, reject) => {
        let queryParams = '?serviceKey=' + apiKeyEncoding+ 
        '&pageNo=' + page
        + '&numOfRows=' +cnt   
        + '&LAWD_CD=' + lawd
        + '&DEAL_YMD=' + ymd;


        request({
            url: aprtApiUrl + queryParams,
            method: 'GET'
        }, function (err, response, body) {
            if(err){
                reject(err);
            }
            let data = xmlToJson(body);
            resolve(data);
        });
    });
}

router.get('/', async (req, res) => {
    try{
        let pageNo = '1';
        let numOfRows= '1';
        let lawdCd = '11110';
        let dealYmd = '202201';
        
        let results = await getApartment(pageNo, numOfRows, lawdCd, dealYmd);
        //console.log("totalCount " + results);
        let totalCnt =results.response.body.totalCount._text; //.response.body.totalCount._text;
        console.log("totalCnt" + totalCnt);
    
        results = await getApartment(pageNo, totalCnt, lawdCd, dealYmd);
        
        results.response.body.items.item.forEach((item)=> {
            const data= {
                'transactionAmount': item.거래금액._text,  
                'constructionYear': item.건축년도._text,     
                'roadName' :item.도로명._text,
                'courtBuilding': item.법정동._text,        
                'courtBuildingCityCode': item.법정동시군구코드._text,  
                'courtBuildingTownCode': item.법정동읍면동코드._text, 
                'apartment' :item.아파트._text ,
                'year': item.년._text,
                'month': item.월._text,              
                'day': item.일._text,              
                'serialNumber':item.일련번호._text ,       
                'area': item.전용면적._text,    
                'number':item.지번._text,       
                'floor':item.층._text  
            };
            console.log(data); 
            insertApart(data);
        }) 
        return res.json({data: results});
    }catch(err) {
        console.log(err);
    }
});

const selectApart = (data) => {
    return new Promise((resolve , reject ) => {
        var query = "SELECT * from apartment WHERE apartment = '" + data.apartment + "'and serialNumber='" +data.serialNumber + "';";

        connection.query(query, function (err, results, fields) {
            if (err) {
                reject(err);
            }
    
            resolve(results);
        });  
    })

}
const insertApart = (data) => {

        let  result = selectApart(data);
        result.then((existApart) =>{
           
            if(existApart.length > 0){
                return;
            }
            var query = "INSERT INTO apartment ( " 
            + " transactionAmount, constructionYear, roadName, courtBuilding, courtBuildingCityCode, "   
            + "courtBuildingTownCode, apartment, year, month, day, serialNumber, area, number, floor "
            +       ") VALUES ('" + data.tranctionAmount + "' , '" + data.constructionYear + "' , '" + data.roadName + "' , '" + 
            data.courtBuilding  + "' , '" + data.courtBuildingCityCode + "' , '" + data.courtBuildingTownCode + "' , '" +
            data.apartment + "' , '"+ data.year + "' , '" + data.month + "' , '" + data.day + "' , '" + data.serialNumber + "' , '"
            + data.area + "' , '" + data.number+ "' , '"+ data.floor +  "');";
            console.log(query);
            
            connection.query(query, function (err, results, fields) {
                if (err) {
                console.log(err);
                }
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = router;


/*지역코드 가져오기 
const getCodeCode = async () => {
    try {
        let page = 1;
        let perPage=50;
        let returnType="json";
        let queryParams = "?page="+ page +  "&perPage=" + perPage + "&returnType=" + returnType
        + "&apiKey=" + apiKeyEncoding;
        request({
            url: codeApiUrl + queryParams,
            method: 'GET'
        }, function (error, response, body) {

           // let data = xmlToJson(body);
            console.log(response.data);
        });
        return true;
    } catch(error) {
        console.log("sendRequest::error", error);
    }
}
*/
