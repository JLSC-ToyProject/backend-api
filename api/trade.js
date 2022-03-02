const {ApartmentPrice,Op} = require('../models');
const request = require('request');
const {xmlToJson} = require('../module');

module.exports.getTrade = async (lawdCdNm , yymmList )=>{
    //lawdCdNm : [[지역번호,지역이름],[지역번호,지역이름]...... ];
    const tradeSecretEnKey = process.env.TRADESECRETENKEY;
    //subkey
    // const tradeSecretEnKey = '2HIeDLqd4eSLgDCAf9F5m4M6g4BNIeXa0m5J%2Ftyl8gXFeiUDL0EP8%2FMxD5Nl1J1gxM7V23XMUHsf6q5YANb4xw%3D%3D';
    // const tradeSecretDeKey = 'CBTMH//2byGmVDlIOfwujuFQDtX5a+YMzA+esYsZNzaKjctiVKg2XOONAJdDOlL/IPUnCEueAJGQejFQMqdovw==';



    const tradeUrl = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?type=xml';
    

        let DEAL_YMD=yymmList;
        
       
        let LAWD_CD = lawdCdNm[0];         //법정동코드 앞 5자리
        let LAWD_NM = lawdCdNm[1];         //구 명
        
    const option ={
        methods:'GET',
        url : `${tradeUrl}&LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&serviceKey=${tradeSecretEnKey}`
    }

    request(option, (err,res)=>{
        var jsonVal = xmlToJson(res.body);

        console.log(jsonVal.response);
        // return false;
        var result = jsonVal['response']['body']['items']['item'];
        console.log(result);
        
        for(var i  in result ){

            if(result[i]['거래금액']===undefined) {result[i]['거래금액']={_text:''} } 
            if(result[i]['건축년도']===undefined) {result[i]['건축년도']={_text:''} } 
            if(result[i]['법정동']===undefined) {result[i]['법정동']={_text:''} } 
            if(result[i]['아파트']===undefined) {result[i]['아파트']={_text:''} } 
            if(result[i]['년']===undefined) {result[i]['년']={_text:''} } 
            if(result[i]['월']===undefined) {result[i]['월']={_text:''} } 
            if(result[i]['일']===undefined) {result[i]['일']={_text:''} } 
            if(result[i]['전용면적']===undefined) {result[i]['전용면적']={_text:''} } 
            if(result[i]['지번']===undefined) {result[i]['지번']={_text:''} } 
            if(result[i]['지역코드']===undefined) {result[i]['지역코드']={_text:''} } 
            if(result[i]['층']===undefined) {result[i]['층']={_text:''} } 
            if(result[i]['해제여부']===undefined) {result[i]['해제여부']={_text:''} } 
            


            ApartmentPrice.create({
                dealAmount: Number(result[i]['거래금액']['_text'].trim().replaceAll(',','')),         //거래금액
                buildYear : result[i]['건축년도']['_text']  ,             //건축년도
                dong : result[i]['법정동']['_text']  ,                   //법정동
                aprtmentName : result[i]['아파트']['_text']  ,           //아파트명
                dealYear : result[i]['년']['_text'],                      //년
                dealMonth : result[i]['월']['_text'],                     //월
                dealDay : result[i]['일']['_text'],                       //일
                areaForExUse : result[i]['전용면적']['_text'],            //전용면적
                jibun : result[i]['지번']['_text'],                       //지번
                regionCd : result[i]['지역코드']['_text'],                //지역코드
                floor : result[i]['층']['_text'],                         //층
                cancelType : result[i]['해제여부']['_text'],              //해제여부 
                address : `${LAWD_NM} ${result[i]['법정동']['_text']} ${result[i]['지번']['_text']}`
            });
        }

        //시도 + 시군구 + 읍면동 _번지 검색하면 주소정확히나옴
    });

 
     
}   

module.exports.getNolocation =async ()=>{
    const result =  await ApartmentPrice.findAll({
        attributes: ['id','address'],
        where : {
            xlocation : {[Op.eq]: null },
            ylocation : {[Op.eq]: null },    }
    });
    
    //[{adress:'주소' , id:id} ,{adress:'주소' , id:id}  ... ] 
    return result.map(v=>v.dataValues); 
 

}