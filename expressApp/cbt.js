var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timelog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.post('/requestTransaction', function (req, res) {
  res.send('Birds home page')
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
