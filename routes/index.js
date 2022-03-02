const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test.html', { title: 'Express' });
});

module.exports = router;