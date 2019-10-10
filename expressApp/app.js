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

app.post('/',async (req, res, next) => {
  let f = req.param('first')
  let l = req.param('last')
  res.send(f+l)
})

var path = require("path");
app.post('/sample',function(req,res){
  //res.sendFile(path.join(__dirname+'/sample.html'))
  console.log(req.body)
  var f = req.body.first
  var l = req.body.last
  console.log(f+l)
  res.json(req.body)
  //__dirname : It will resolve to your project folder.
})

app.use('/cbt', cbt)
app.use('/bank', bank)

app.listen(port, () => console.log('Example app listening on port'+ port))