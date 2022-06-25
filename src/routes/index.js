var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
  res.send({
    status: '200',
    message: 'Welcome to the API'
  })
});



module.exports = router;
