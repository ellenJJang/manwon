var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require('fs');
var moment = require('moment');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var records = [];
app.get('/', function (req, res) {
	var params = {
		date    : moment(new Date()).format("DD/MM/YYYY"),
	  	history : records
	};

  res.render('main.html', params);
});

app.post('/submit', function (req, res){
	var dayRecord = {
		date : moment(new Date()).format("DD/MM/YYYY"),
		list : [{'subject' : req.body.subject, 'cost' : req.body.cost}]
	};
	records.push(dayRecord);
	fs.writeFile('data.log', JSON.stringify(records));
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
	var fileString = fs.readFileSync('data.log', 'utf8');
	console.log(fileString);
	records = JSON.parse(fileString);
	console.log(records);
  	console.log('READY');
});
