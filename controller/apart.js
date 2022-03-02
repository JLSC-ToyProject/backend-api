var express = require('express');
var router = express.Router();
const {getCurrentYearTrade , getTradeApartList } = require('../service/apart')

router.get('/getCurrentYearTrade', async function(req, res) {
    return res.json(await getCurrentYearTrade())
  });

 
  router.post('/getTradeApartList', async function(req, res) {
    return res.json(await getTradeApartList(req.body));
  });

  router.get('/getTopPriceApartList',async function(req,res){
    return res.json(await getTopPriceApartList());
  });
  
  
  router.get('/getDownPriceApartList',async (req,res)=>{
    return res.json(await getDownPriceApartList());
  });
  
  router.get('/getSearchApartList',async (req,res)=>{
    return res.json(await getDownPriceApartList());
  });
    

  module.exports = router;