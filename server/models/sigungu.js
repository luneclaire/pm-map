var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sigunguSchema = new Schema({
    dateTime : 'string',
    sidonm: 'string',
    sigungunm: 'string',
    pm : 'number',
    fpm : 'number'
})

module.exports = mongoose.model('Sigungu', sigunguSchema);