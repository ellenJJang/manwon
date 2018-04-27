var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordSchema = new Schema({
    date	: String,
    subject	: String,
    cost	: Number
});

module.exports = mongoose.model('record', recordSchema);