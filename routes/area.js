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

const codeApiUrl = process.env.OPEN_API_CODE_URL;
const apiKeyEncoding = process.env.OPEN_API_KEY_ENCODING;

const getArea = async (page, perPage, returnType) => {
    return new Promise((resolve, reject) => {
        let queryParams = "?page="+ page +  "&perPage=" + perPage + "&returnType=" + returnType
        + "&serviceKey=" + apiKeyEncoding;
        request({
            url: codeApiUrl + queryParams,
            method: 'GET'
        }, function (err, response, body) {

            if(err){
                console.log(err);
            }
            //console.log(response);
           //let data = xmlToJson(body);
           resolve(body);
        });
    });
}

router.get('/', async (req, res) => {
    try{
        let page = 1;
        let perPage=1;
        let returnType="json"; 

        let totalCntArea = await getArea(page, perPage, returnType);

        let parseData =JSON.parse(totalCntArea);
        let totalCnt = parseData.totalCount;

        let totalArea = await getArea(page, totalCnt, returnType);
    
        parseData =JSON.parse(totalArea);

        parseData.data.forEach((item)=>{
            const data= {
                    'organization': item.기관명칭,  
                    'useYn': item.사용여부,     
                    'cityCountyCode' :item.시군구코드,
                    'cityStateCode': item.시도코드,         
            };
            insertArea(data);
        })

        return res.json({data: totalArea});
    }catch(err){
        console.log(err);
    }
});

const selectArea = (data) => {
    return new Promise((resolve , reject ) => {
        var query = "SELECT * from area  WHERE organization = '" + data.organization + "'and cityCountyCode='" +data.cityCountyCode + "';";

        connection.query(query, function (err, results, fields) {
            if (err) {
                reject(err);
            }
    
            resolve(results);
        });  
    })
};

const insertArea = async (data) => {
    try{
        let  result = await selectArea(data);
        console.log(result);
        if(result.length > 0){
            return;
        }
        var query = "INSERT INTO area ( " 
        + " organization, useYn, cityCountyCode, cityStateCode "   
        +       ") VALUES ('" + data.organization + "' , '" + data.useYn + "' , '" + data.cityCountyCode + "' , '" + 
        data.cityStateCode   +  "');";
        
        connection.query(query, function (err, results, fields) {
            if (err) {
            console.log(err);
            }
        });
  
    }catch(err){
        console.log(err);
    }
}
module.exports = router;
