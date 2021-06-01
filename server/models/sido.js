var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sidoSchema = new Schema({
    dateTime : 'string',
    sidonm : 'string',
    pm : 'number',
    fpm : 'number'
});

module.exports = mongoose.model('Sido', sidoSchema);