var express = require('express')
var router = express.Router()

var createAccount = require('./createAccount.js');
var viewAccount = require('./viewAccount.js');
var interBankFundTransfer = require('./interBankFundTransfer.js');
var otherBankFundTransfer = require('./otherBankFundTransfer.js');


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route

router.post('/createAccount', async (req, res, next) => {
  try{
    let response = await createAccount("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "bankchannel", "bacc300", [req.body.bankName, req.body.accountNo, req.body.userName, req.body.initBalance]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})
// define the about route

router.post('/interBankFundTransfer', async (req, res, next) => {
  try{
    let response = await interBankFundTransfer("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "bankchannel", "bacc300", [req.body.fromBankName, req.body.fromAccountNo, req.body.toBankName, req.body.toAccountNo, req.body.amount]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/otherBankFundTransfer', async (req, res, next) => {
  try{
    let response = await otherBankFundTransfer("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "bankchannel", "bacc300", [req.body.fromBankName, req.body.fromAccountNo, req.body.toBankName, req.body.toAccountNo, req.body.amount]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/viewAccount', async (req, res, next) => {
  try{
    let response = await viewAccount("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "bankchannel", "bacc300", [req.body.bankName, req.body.accountNo]);
    console.log(typeof response);
    console.log(response);
    res.send(JSON.stringify(response, undefined, 4));
  }catch(e){
    next(e)
  }
})

router.post('/deleteAccount', async (req, res, next) => {
  try{
    // ToDo: call delete account function

    // ToDo: return response
    res.send('function not defined yet!');
  }catch(e){
    next(e)
  }
})

module.exports = router;