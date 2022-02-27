const {ApartmentPrice , Apartment,sequelize} = require('../models');

module.exports.getCurrentYearTrade = async ()=>{

    var query = "SELECT A.* FROM apartmentprices A WHERE XLOCATION IS NOT NULL AND DEALYEAR='2021' GROUP BY CONCAT(APRTMENTNAME, DONG ,ADDRESS,XLOCATION,YLOCATION)";
  
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