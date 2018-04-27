var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var mongoose    = require('mongoose');
var Record 		= require('./models/record');
var Stat 		= require('./models/stat');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var router 		= require('./routes')(app, Record, Stat);

app.listen(process.env.PORT || 3000, function () {
	var db = mongoose.connection;
	db.on('error', console.error);
	db.once('open', function(){
	    console.log("Connected to mongod server");
	});

	mongoose.connect('mongodb://manwon:manwon@ds261429.mlab.com:61429/manwon');
  	console.log("ready..");
});
