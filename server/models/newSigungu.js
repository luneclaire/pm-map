const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    sigunguName : 'string',
    pm : 'number',
    fpm : 'number'
})

const newsigunguSchema = new Schema({
    dateTime : {type: String, required:true},
    sidoName: {type: String, required:true},
    data : [dataSchema]
})

newsigunguSchema.index({ dateTime: -1, sidoName: 1 });

module.exports = mongoose.model('newSigungu', newsigunguSchema);