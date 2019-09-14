const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
});

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    videos: []
});

module.exports = mongoose.model('Course', courseSchema);