var express = require('express');
var router = express.Router();

router.get('/', (req,res) => {
    res.send({greeting:'hello react x node.js'});
});

module.exports = router;