const express = require('express')
const app = express()
const port = 3000
var cbt = require('./cbt')
var bank =  require('./bank')
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var cors = require('cors')
app.use(cors())


app.get('/', function (req, res, next) {
  res.send('server accessible.')
  next()
})

// route to cbt.js
app.use('/cbt', cbt)

// route to bank.js
app.use('/bank', bank)

// start server to listen requests
app.listen(port, () => console.log('Example app listening on port'+ port))
