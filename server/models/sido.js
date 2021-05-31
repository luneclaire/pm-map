var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sidoSchema = new Schema({
    sidoName : 'string',
    dateTime : 'string',
    pm10Value : 'number',
    pm25Value : 'number'
});

module.exports = mongoose.model('Sido', sidoSchema);