const mongoose = require('mongoose')

const awardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    categoryId: {type: Number, required: true }
})

module.exports = mongoose.model('Award', awardSchema)