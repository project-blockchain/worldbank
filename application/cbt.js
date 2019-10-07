var express = require('express')
var router = express.Router()
var requestTransaction = require('./requestTransaction.js');

// middleware that is specific to this router
router.use(function timelog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})



router.post('/requestTransaction', async (req, res, next) =>{
    console.log("request: " + req.param('requesterName'));
    try{
      let requesterObj = {"name": "address":"addr", "bankAccount":{"bankName":"xbank", "accountNo":"1"}} ;
      let supplierObj  = {"name": "akshay", "address":"addr2", "bankAccount":{"bankName":"hdfc", "accountNo":"1"}};
      let productObj  = {"id": "65", "name": "steel material", "quantity": "40", "amount": "4000"};
      let description  = "this is desc. from requestor";
      let response = await requestTransaction("xbank", "User1", "82592ffb23cc9207d8023a51374c1f75e803fefd96d23faf301b18c62c9da779", "cbtchannel", "cbt20", [requesterObj, supplierObj, productObj, description]);
      console.log(typeof response);
      console.log('it should after response');
      console.log(response);
      res.send(response);
    } catch(e) {
      next(e)
    }
})
// define the about route
router.post('/productSupplierApproval', function (req, res) {
  res.send('About birds')
})

router.post('/recieversBankApproval', function (req, res) {
  res.send('About birds')
})

router.post('/productTransfer', function (req, res) {
  res.send('About birds')
})

router.post('/orderFulfillment', function (req, res) {
  res.send('About birds')
})

router.post('/updateProductDeliveryStatus', function (req, res) {
  res.send('About birds')
})


module.exports = router