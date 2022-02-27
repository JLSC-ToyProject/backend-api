const express = require('express');
const router = express.Router();
const {ApartmentPrice,sequelize} = require('../models');

//전국아파트 api 호출 및 db저장 
router.get('/getApartments',async (req,res)=>{
    try{
         const {getApartments } = require('../api/apartment');
         getApartments(20000,req,res);
    }catch(err){
        console.log(err);
    }
});


//법정동 리스트를 가져와서 하루 트래픽 초과를 하지않는선에서 넣어줘야한다.
//( 배치작업 필요)
router.get('/getTradeList/:year',async (req,res,next)=>{
    const {makeMonthArr } =require('../module');

    try{
        const year = req.params.year;
        if(await ApartmentPrice.findOne({
            where:{ dealYear : year}
        })){
            
            return res.json('이미 있는 년도입니다. 다시확인하고 입력해주세요.');

        }
        
        const {getBjdCdList} = require('../api/apartment');
         
         const bjdResult = await getBjdCdList() ;
        // const bjdResult = [[ '42150', '강원도 강릉시' ],[ '42110', '강원도 춘천시' ],[ '42130', '강원도 원주시' ]];
        const {getTrade} = require('../api/trade');

        let yymmList = makeMonthArr(year)
        
        var i = 0 ; var j = 0 ;
        var cnt = 0 ; 
            var run = setInterval(()=>{
                if(cnt ==bjdResult.length * yymmList.length) {
                    clearInterval(run);
                    console.log("수집종료");
                    return res.json(`${year}년도 수집완료`);
                }else{
                    if(i<bjdResult.length){

                        getTrade(bjdResult[i] , yymmList[j]);
                        cnt++; i++;
                    }else if( i >=bjdResult.length){
                        j++ ; i=0;
                    }
                }
            }, 10);

    }catch(err){
        console.log(err);
        next();
    }

});
//좌표설정이 안된 거래들 찾아서 좌표 넣어준다. 하루 10만건 , 한달 300만건제한있음 .
router.get('/setLocation',async (req,res,next)=>{

    const {getNolocation} =require('../api/trade');
    const locationList = await getNolocation();
    const {updateLocation} = require('../api/trade/location');

    var i = 0 ; 
    var run = setInterval(()=>{
         if(i ==locationList.length) {
             clearInterval(run);
             console.log("수집종료 ")
             return res.json("좌표등록완료");
         }else{
             updateLocation(locationList[i]);
             i++
         }
    }, 10)
});



module.exports = router;