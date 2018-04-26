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
var DAY_GOAL = 50000;
var today = moment(new Date()).format("DD/MM/YYYY");
var remains = 0;

app.get('/', function (req, res) {
	var params = {
		date    : today,
	  	history : records
	};

  res.render('main.html', params);
});

app.post('/submit', function (req, res){
	var added = false;
	records.forEach(function(value){
		if(value.date === today){
			value.list.push({'subject' : req.body.subject, 'cost' : new Number(req.body.cost)});
			value.sum = new Number(value.sum) + new Number(req.body.cost);
			value.remain = new Number(value.remain) - new Number(req.body.cost);
			added = true;
		}
	});

	if(!added) {
		var record = {
			'date' 		: today,
			'list' 		: [{'subject' : req.body.subject, 'cost' : new Number(req.body.cost)}],
			'sum' 		: new Number(req.body.cost),
			'remain' 	: remains + DAY_GOAL - new Number(req.body.cost)
		};
		records.push(record);
	}
	fs.writeFile('data.log', JSON.stringify(records));
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
	var fileString = fs.readFileSync('data.log', 'utf8');
	records = JSON.parse(fileString);

	if(records.length != 0){
		remains = records[records.length-1].remain;
	}
	console.log('남은금액 '+remains);
  	console.log('READY');
});
