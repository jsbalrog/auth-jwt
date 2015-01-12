var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

var user = {
	username: 'edwardjenkins',
	password: 'tal'
};

app.use(cors());
// Need to be able to read the POSTed username, password
app.use(bodyParser.json());

app.get('/random-user', function(req, res) {
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/login', authenticate, function(req, res) {

});

// Middlewares
function authenticate(req, res, next) {
	var body = req.body;
	if(!body.username || !body.password) {
		res.status(400).end('Must provide username or password!');
	}
	if(body.username !== user.username || body.password !== user.password) {
		res.status(401).end('Username or password incorrect');
		next();
	}
}

app.listen(8000, function() {
  console.log('App listening on localhost:8000');
});
