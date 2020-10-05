var express = require('express')
var bodyParser = require('body-parser')
var basicAuth = require('express-basic-auth')
var {decoder} = require('./script/orange-payload-parser.js')


var app = express()
var port = 3000

var jsonParser = bodyParser.json({ type: 'application/json' })

var myLogger = function (req, res, next) {
  console.log(JSON.stringify(req.body, null, 2))
  // console.log(req.body)
  next()
}

var myBodyDecoder = function (req, res, next) {
	req.body = decoder(req.body.payload.data)
  next()
}

var myParamDecoder = function (req, res, next) {
	req.body = decoder(req.params.value)
  next()
}

var myPostCallbacks = [myBodyDecoder, myLogger]
var myGetCallbacks = [myParamDecoder, myLogger]

app.use(jsonParser)

app.get('/', (req, res) => {
  res.send({title: 'Orange payload parser is ready!'})
})

app.use(basicAuth({
  authorizer: (username, password) => {
    const userMatches = basicAuth.safeCompare(username, 'admin')
    const passwordMatches = basicAuth.safeCompare(password, 'orange')
    return userMatches & passwordMatches
  },
	unauthorizedResponse: (req) => {
    return 'Unauthorized request!'
  }
}))

app.get('/api/payload/:value', myGetCallbacks, (req, res) => {
	res.send(req.body)
})

app.post('/api/payload',myPostCallbacks, function (req, res) {
	res.send(req.body)
})

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.use(function(req, res){
  res.status(404);
  res.send({ error: "Resource Not Found" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})