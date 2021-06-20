const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    sidoName : 'string',
    pm : 'number',
    fpm : 'number'
});
const sidoSchema = new Schema({
    dateTime : {type: String, required:true, unique:true},
    data : [dataSchema]
});
sidoSchema.index({ dateTime: -1 });

module.exports = mongoose.model('sido', sidoSchema);