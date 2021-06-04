var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
    lastBuildDate: 'string',
    total: 'number',
    start: 'number',
    display: 'number',
    items: {
        title: 'string',
        originallink: 'string',
        link: 'string',
        description: 'string',
        pubDate: 'string'  
    }
});

module.exports = mongoose.model('news', newsSchema);