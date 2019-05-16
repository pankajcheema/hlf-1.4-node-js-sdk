var express = require('express');
var router = express.Router();
var clientregister = require("../Controller/ClientRegisterController")

/* GET users listing. */
router.get('/register-admin', function (req, res, next) {
    clinetregister = new clientregister();
    clinetregister.RegisterAdmin().then((result) => {
        res.status(result.httpstatus).json(result);
    }).catch((error) => {
        res.status(error.httpstatus).json(error);
    })

});

router.get('/register-user', function (req, res, next) {
    clinetregister = new clientregister();
    clinetregister.RegisterUser().then((result) => {
        res.status(result.httpstatus).json(result);
    }).catch((error) => {
        res.status(error.httpstatus).json(error);
    })

});

module.exports = router;
