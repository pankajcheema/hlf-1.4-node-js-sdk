
var express = require('express');
var router = express.Router();
var UserController = require("../Controller/UserController")
usercontroller = new UserController();
/* GET users listing. */
router.post('/add-user', function (req, res, next) {

  usercontroller.RegisterUser(req.body).then((result) => {

    res.status(result.httpstatus).json(result);
  }).catch((error) => {
    res.status(error.httpstatus).json(error);
  })


});

router.get('/get-user/:id', function (req, res, next) {

  usercontroller.GetUser(req.params.id).then((result) => {

    res.status(result.httpstatus).json(result);
  }).catch((error) => {
    res.status(error.httpstatus).json(error);
  })


});

module.exports = router;
