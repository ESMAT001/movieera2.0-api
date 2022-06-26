const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send({
        status: '200',
        message: 'Welcome to the API'
    })
})

module.exports = router;