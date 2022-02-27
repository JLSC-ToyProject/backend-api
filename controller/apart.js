var express = require('express');
var router = express.Router();
const {getCurrentYearTrade , getTradeApartList } = require('../service/apart')

router.get('/getCurrentYearTrade', async function(req, res) {
     ; 
    return res.json(await getCurrentYearTrade())
    
  });

 
  router.post('/getTradeApartList', async function(req, res) {
    console.log(req.body);
    
    ;
    ; 
    return res.json(await getTradeApartList(req.body));
    
  });



  module.exports = router;