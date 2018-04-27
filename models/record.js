var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	subject	: String,
    cost	: Number
});

var recordSchema = new Schema({
    date	: String,
    list 	: [contentSchema],
    sum		: Number,
    remain	: Number
});

module.exports = mongoose.model('record', recordSchema);