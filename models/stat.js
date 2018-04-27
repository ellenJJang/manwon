var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statSchema = new Schema({
    date	: String,
    sum		: Number,
    remain	: Number
});

module.exports = mongoose.model('stat', statSchema);