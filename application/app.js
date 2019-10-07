const express = require('express')
const app = express()
const port = 3000
var cbt = require('./cbt')
var bank =  require('./bank')


app.get('/', function (req, res, next) {
  res.send('hello world!')
  next()                     //dashboard
})

app.get('/user', function (req, res) {
	res.send('hello world again!')
})

app.use('/cbt', cbt)
app.use('/bank', bank)

app.listen(port, () => console.log('Example app listening on port'+ port))