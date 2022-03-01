const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const mysql = require('mysql');  // mysql 모듈 로드
const selectArea = require('./area.js');

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
const apiKeyEncoding = process.env.OPEN_API_KEY_ENCODING;

const apartItem = require('../models/apartItem.js');
const { resolve } = require('path');

let pageNo = '1';
let numOfRows= '1';
let today = new Date();  
let year = today.getFullYear();
let month = today.getMonth(); // 원래 +1 해야함.
   
router.get('/', async (req, res) => {
    try{
        let {year, month, courtBuildingStateCode, courtBuildingCityCode, apartment, serialNumber} = req.body; 
          
        if(!year) year = -1;
        if(!month) month = -1;
        if(!courtBuildingStateCode) courtBuildingStateCode = -1; 
        if(!courtBuildingCityCode) courtBuildingCityCode = -1; 
        if(!apartment) apartment = null;
        if(!serialNumber) serialNumber= -1;

        const data ={
            'year' : year,
            'month' : month,
            'courtBuildingStateCode' : courtBuildingStateCode,
            'courtBuildingCityCode' : courtBuildingCityCode , // 앞에 있는 City 
            'apartment' : apartment,
            'serialNumber' : serialNumber
        }
        console.log(data);
        let results = await selectApart(data);

        return res.json({data: results});
    }catch(err){
        console.log(err);
    }
});

const  prevApart  = (data) => {
    return new Promise( async (resolve, reject) => {

    let prevApart = await selectApart(data);

    if(prevApart.length > 0) {
        let apart = new apartItem(data.area, data.apartment, data.transactionAmount, ''.concat(year, month), 
            Math.abs(parseInt(data.tranctionAmount) - parseInt(prevApart.tranctionAmount)));  
        resolve(apart);
    }
    else { 
        // 등락폭을 0으로 해서 넣음.
        let apart = new apartItem(data.area, data.apartment, data.transactionAmount,  ''.concat(year, month), 
            0);
        resolve(apart);
    }
})
}
/**
 * 기본 시세 정보 리스트
 * 1. 지역 / 아파트 / 시세 / 날짜(현재 년월 - 202202) / 등락폭(이전 1, 3, 6, 12개월)
 * 2. 디폴트는 리스트 정렬 등락폭 이전 달과 비교해서 가장 많이 오른 아파트 순 (50%)
 */
router.get('/list', async (req, res) => {
     try{
        let {courtBuildingStateCode, courtBuildingCityCode, prev} = req.body; 
        if(!prev) prev= 1;
        if(!courtBuildingStateCode) courtBuildingStateCode = -1; 
        if(!courtBuildingCityCode) courtBuildingCityCode = -1; 
        
      
        const data ={
            'year' : year,
            'month' : month,
            'courtBuildingStateCode' : courtBuildingStateCode,
            'courtBuildingCityCode' : courtBuildingCityCode , // 앞에 있는 City 
            'apartment' : null,
            'serialNumber' : -1
        }
        //현재 달의 아파트 가지고 옴.
        let results = await selectApart(data);
        
        let prevMonth = month - prev;
        if(prevMonth <= 0) prevMonth += 12;

        let apartList = [];
        let promise =  new Promise(async (resolve, reject) => {
            while(results.length != 0) {
                let item = results.pop();
                const data ={
                'year' :  year,
                'month' : prevMonth,
                'courtBuildingStateCode' : courtBuildingStateCode,
                'courtBuildingCityCode' : courtBuildingCityCode , // 앞에 있는 City 
                'apartment' : item.apartment,
                'serialNumber' : -1
                }
                let apart  = await prevApart(data);
                apartList.push(apart); 
            }
            resolve(apartList);
        });
         
        promise.then((apartList)=> {
            apartList.sort((a,b ) => (a.rockWidth >  b.rockWidth ) ? 1 : -1);
            return res.json({data: apartList});
        })
       
       
    }catch(err){
        console.log(err);
    }
});

/**
 * 거래 연도에 따른 cityStateCode 에 있는 아파트 저장
 * dealYmd : 거래 연도 (202202)
 */
router.post('/', async (req, res) => {
    try{
        const { cityStateCode , dealYmd } = req.body;
        if(!cityStateCode) cityStateCode = '11';
        if(!dealYmd) dealYmd = '202202';

        // 서울에 있는 모든 법정동 코드를 가져옴
        const data= {
            'organization': null,
            'cityCountyCode' :-1,
            'cityStateCode': cityStateCode   
        };
        let results = await selectArea(data);
        
        // 포털에 불러와서 db에 아파트 저장
        results.forEach(async (item) => {
            const lawdCd = item.cityStateCode + item.cityCountyCode;

            results = await insertApratmentByLawdCdAndDealYmd(lawdCd, dealYmd);
        })
        return res.json({data: results});
    }catch(err){
        console.log(err);
    }
});


/**
 * 조건에 따른 apartment 포털에서 가져와 db 에 저장
 * lawdCd : 법정동 (11110)
 * dealYmd : 거래 연도 (202202)
 */
const insertApratmentByLawdCdAndDealYmd = async (lawdCd, dealYmd) =>{
    try{     
        if(!lawdCd)  lawdCd = '11110'; // 종로구
        if(!dealYmd) dealYmd = '202202';

        let results = await getApartment(pageNo, numOfRows, lawdCd, dealYmd);
        
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
};


/**
 * portal에서 아파트 시세정보 가져오기
 */
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

/**
 * db 에서 apartment 조회
 */
const selectApart = (data) => {
    return new Promise((resolve , reject ) => {
        var query = "SELECT * from apartment WHERE apartment is not null ";
        if(data.year != -1)
            query += "and year = '" + data.year + "'";
        if(data.month != -1)
            query += "and month='" +data.month + "'";
        if(data.courtBuildingStateCode != -1)
            query += "and LEFT(courtBuildingCityCode ,2) ='" +data.courtBuildingStateCode + "'" ;
        if(data.courtBuildingCityCode  != -1)
            query += "and courtBuildingCityCode  ='" +data.courtBuildingCityCode  + "'" ;
            if(data.apartment)
            query += "and apartment = '" + data.apartment + "'";
        if(data.serialNumber != -1)
            query += "and serialNumber = '" + data.serialNumber + "'";
        
        query += ";";
        console.log(query);
        connection.query(query, function (err, results, fields) {
            if (err) {
                reject(err);
            }
    
            resolve(results);
        });
    })
}

/**
 * db 에 apartment 저장
 */
const insertApart = (data) => {

        let  result = selectApart(data);
        result.then((existApart) =>{
           
            if(existApart.length > 0){
                return;
            }
            var query = "INSERT INTO apartment ( " 
            + " transactionAmount, constructionYear, roadName, courtBuilding, courtBuildingCityCode, "   
            + "courtBuildingTownCode, apartment, year, month, day, serialNumber, area, number, floor "
            +       ") VALUES ('" + data.transactionAmount + "' , '" + data.constructionYear + "' , '" + data.roadName + "' , '" + 
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


