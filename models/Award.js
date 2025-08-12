const mongoose = require('mongoose')

const awardSchema = new mongoose.Schema({
    awardId: {type: String, required: true},
    title: { type: String, required: true },
    categoryId: {type: String, required: true }
})

module.exports = mongoose.model('Award', awardSchema)