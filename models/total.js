var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var totalSchema = new Schema({
	startDate   : String,
    totalSum	: Number
});

module.exports = mongoose.model('total', totalSchema);