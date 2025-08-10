const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: { type: Number, required: true, unique: true },
    guildId: { type: Number, required: true },
    title: { type: String, required: true },
    dateUTC: { type: Date, required: true },
    roles: { type: Array },
    signups: { type: Array },
    waitlist: { type: Array },
    createdBy: { type: String, required: true },
    reminderSent: { type: Boolean }
})

module.exports = mongoose.model('Event', eventSchema);