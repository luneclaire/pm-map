const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    sigunguName : 'string',
    pm : 'number',
    fpm : 'number'
})

const sigunguSchema = new Schema({
    dateTime : {type: String, required:true},
    sidoName: {type: String, required:true},
    data : [dataSchema]
})

sigunguSchema.index({ dateTime: -1, sidoName: 1 });

module.exports = mongoose.model('sigungu', sigunguSchema);