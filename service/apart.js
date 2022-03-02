const {ApartmentPrice , Apartment,sequelize} = require('../models');

module.exports.getCurrentYearTrade = async ()=>{

    var query = "SELECT A.* FROM ApartmentPrices A WHERE XLOCATION IS NOT NULL AND DEALYEAR='2021' GROUP BY CONCAT(APRTMENTNAME, DONG ,ADDRESS,XLOCATION,YLOCATION)";
  
    try{
        var result = await sequelize.query(query , { type:sequelize.QueryTypes.SELECT})
        return result;
    }catch(err){
        console.error(err);
        // next();
    }
}
module.exports.getTradeApartList = async (location)=>{
    try{
        var result = await ApartmentPrice.findAll({
            where:{ xlocation : location['xlocation'],
                    ylocation : location['ylocation']}
        })
        return result;
    }catch(err){
        console.error(err);
       
    }
}
module.exports.getTopPriceApartList = async ()=>{
    try{
        console.log("111")
        let result= await ApartmentPrice.findAll({
            attributes:[
                'dealYear',
                'dealMonth',
                'aprtmentName',
                'dong',
                [sequelize.fn("AVG", sequelize.col("dealAmount")), "avgAmtCnt"],
                [sequelize.fn("COUNT", sequelize.col("aprtmentName")), "trdCnt"],
            ],
            group:['dealYear','dealMonth','aprtmentName'],
            order : [
                [sequelize.fn('AVG', sequelize.col('dealAmount')),'ASC' ]
            ]
        });
        return result;
    }catch(err){
        console.error(err);
    }
}
module.exports.getDownPriceApartList = async ()=>{
    try{
   
        return ;
    }catch(err){
        console.error(err);
    }
}
module.exports.getSearchApartList = async ()=>{
    try{
   
        return ;
    }catch(err){
        console.error(err);
    }
}