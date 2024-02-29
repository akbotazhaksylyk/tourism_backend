// models/Publication.js
const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Publication = mongoose.model('Publication', PublicationSchema);
module.exports = Publication;