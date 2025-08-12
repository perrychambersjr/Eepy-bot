const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    createdBy: { type: String, required: true }, // userId of creator
    type: { type: String, required: true }, // "wow_raid", "osrs"

    title: { type: String, required: true },
    description: { type: String },

    date: { type: Date },
    difficulty: { type: String }, // for WoW, etc.
    location: { type: String }, // for OSRS, etc.
    gearRequirements: { type: String }, // optional for certain games

    // Config values from eventDetails.json
    defaultRoles: [{ type: String }],
    maxPlayers: { type: Number },

    // Signups array — role assignments
    signups: [
        {
            userId: { type: String, required: true },
            role: { type: String, required: true },
            joinedAt: { type: Date, default: Date.now }
        }
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);