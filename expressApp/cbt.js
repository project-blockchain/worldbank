var express = require('express')
var cbt = express()
var router = express.Router()
var requestTransaction = require('./requestTransaction.js');
var setProductSupplierApproval = require('./setProductSupplierApproval.js');
var setReceiversBankApproval = require('./setReceiversBankApproval.js');
var productTransfer = require('./productTransfer.js');
var updateProductDeliveryStatus = require('./updateProductDeliveryStatus.js');
var orderFulfillment = require('./orderFulfillment.js');
var getCBT = require('./getCBT.js');
var bodyParser = require('body-parser');
cbt.use(bodyParser.json()); // support json encoded bodies
cbt.use(bodyParser.urlencoded({ extended: true }));

// middleware that is specific to this router
router.use(function timelog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.post('/requestTransaction', async (req, res, next) =>{
    console.log("requester: " + req.body.requesterName);
    try{
      // let requesterObj = {"name": "shubham", "address":"addr", "bankAccount":{"bankName":"xbank", "accountNo":"1"}} ;
      // let supplierObj  = {"name": "akshay", "address":"addr2", "bankAccount":{"bankName":"hdfc", "accountNo":"1"}};
      // let productObj  = {"id": "65", "name": "steel material", "quantity": "40", "amount": "4000"};
      // let description  = "this is desc. from requestor";
      let requesterObj = {"id": req.body.requesterId, "name": req.body.requesterName, "address": req.body.requesterAddress, "bankAccount":{"bankName":req.body.requesterBankName, "accountNo":req.body.requesterAccountNo}} ;
      let supplierObj  = {"id": req.body.supplierId, "name": req.body.supplierName, "address": req.body.supplierAddress, "bankAccount":{"bankName": req.body.supplierBankName, "accountNo": req.body.supplierAccountNo}};
      let productObj  = {"id": req.body.productId, "name": req.body.productName, "quantity": req.body.productQuantity, "amount": req.body.productAmount};
      let description  = req.body.description;
      let response = await requestTransaction("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [requesterObj, supplierObj, productObj, description]);
      console.log(typeof response);
      console.log(response);
      res.send(JSON.stringify(response, undefined, 4));
    } catch(e) {
      next(e)
    }
})
// define the about route
router.post('/setProductSupplierApproval', async (req, res, next) => {
    try{
      // let name = "rohit";
      // let txnId = "112345";
      // let supplierApproval = "true";
      // let transporterObj = {"id": "123", "name": "fedx", "address": "fedx address here", "charges": "3000"};
      // let productStatus = {"state": "2", "holder": "tatasteel", "location": "mumbai"};
      // let transactionState = "IN PROCESS";
      // let description = "desc. from supplier";
      let name = req.body.name;
      let txnId = req.body.txnId;
      let supplierApproval = req.body.supplierApproval;
      let transporterObj = {"id": req.body.transporterId, "name": req.body.transporterName, "address": req.body.transporterAddress, "charges": req.body.transporterCharges};
      let productStatus = {"state": req.body.productState, "holder": req.body.productHolder, "location": req.body.productLocation};
      let transactionState = req.body.transactionState;
      let description = req.body.description;
      let response = await setProductSupplierApproval("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId, supplierApproval, transporterObj, productStatus, transactionState, description]);
      console.log(typeof response);
      console.log(response);
      res.send(JSON.stringify(response, undefined, 4));
    } catch(e) {
      next(e)
    }
})

router.post('/setRecieversBankApproval', async (req, res, next) => {
  try{
    // let name = "rohit";
    // let txnId = "112345";
    // let monetaryStatus = {"from": "lnt", "to": "xbank", "value": "4000"};
    // let receiversBankApproval = "true";
    // let description = "desc. from supplier";
    let name = req.body.name;
    let txnId = req.body.txnId;
    let monetaryStatus = {"from": req.body.from, "to": req.body.to, "value": req.body.amount};
    let receiversBankApproval = req.body.receiversBankApproval;
    let description = req.body.description;
    let response = await setReceiversBankApproval("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId, monetaryStatus, receiversBankApproval, description]);  
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/productTransfer', async (req, res, next) => {
  try{
    // let name = "rohit";
    // let txnId = "112345";
    // let from = "lnt";
    // let to = "lnt";
    // let newLocation = "chicago";
    // let state = "3";
    let name = req.body.name;
    let txnId = req.body.txnId;
    let from = req.body.from;
    let to = req.body.to;
    let newLocation = req.body.newLocation;
    let state = req.body.state;
    let response = await productTransfer("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId, from, to, newLocation, state]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/updateProductDeliveryStatus', async (req, res, next) => {
  try{
    // let name = "rohit";
    // let txnId = "112345";
    // let status = "4";
    // let description = "desc. from receiver";
    let name = req.body.name;
    let txnId = req.body.txnId;
    let status = req.body.status;
    let description = req.body.description;
    let response = await updateProductDeliveryStatus("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId, status, description]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/orderFulfillment', async (req, res, next) => {
  try{
    // let name = "rohit";
    // let txnId = "112345";
    // let monetaryStatus = {"from": "xbank", "to": "tatasteel", "value": "4000"};
    // let transactionState = "4";
    // let description = "desc. from receiver's bank";
    let name = req.body.name;
    let txnId = req.body.txnId;
    let monetaryStatus = {"from": req.body.from, "to": req.body.to, "value": req.body.amount};
    let transactionState = req.body.transactionState;
    let description = req.body.description;
    let response = await orderFulfillment("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId, monetaryStatus, transactionState, description]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/getCBT', async (req, res, next) => {
  try{
    // let name = "rohit";
    // let txnId = "112345";
    console.log(req.body);
    let name = req.body.name;
    let txnId = req.body.txnId;
    console.log(name + " " + txnId);
    
    let response = await getCBT("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc300", [name, txnId]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

module.exports = router;