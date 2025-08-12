const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRow, InteractionCallback } = require('discord.js');
const Event = require('../../models/Event');
const eventDetails = require('../../config/event-creation/eventDetails.json')

const command = new SlashCommandBuilder()
        .setName('new-event')
        .setDescription('Create a new event of a specific game.');

    // dynamically create subcommands from eventDetails.json
    Object.entries(eventDetails).forEach(([id, details]) => {
        command.addSubcommand(sub =>
            sub
                .setName(id)
                .setDescription(details.description)
        );

        // add extra options from JSON
        const subcommand = command.options.find(opt => opt.name === id);
        details.options.forEach(optConfig => {
            let optionBuilder;

            // Handle option type
            switch (optConfig.type) {
                case 'string':
                    optionBuilder = sub => sub
                        .addStringOption(option =>
                            option
                                .setName(optConfig.name)
                                .setDescription(optConfig.description)
                                .setRequired(optConfig.required || false)
                        );
                    break;

                case 'integer':
                    optionBuilder = sub => sub
                        .addIntegerOption(option =>
                            option
                                .setName(optConfig.name)
                                .setDescription(optConfig.description)
                                .setRequired(optConfig.required || false)
                        );
                    break;

                case 'choice':
                    optionBuilder = sub => sub
                        .addStringOption(option =>
                            option
                                .setName(optConfig.name)
                                .setDescription(optConfig.description)
                                .setRequired(optConfig.required || false)
                                .addChoices(
                                    ...optConfig.choices.map(c => ({ name: c, value: c }))
                                )
                        );
                    break;
            }

            if (optionBuilder) {
                optionBuilder(subcommand);
            }
        });
    });

module.exports = {
    data: command,
    async execute(interaction) {
        const eventType = interaction.options.getSubcommand();
        const config = eventDetails[eventType];

        const eventData = {};
        config.options.forEach(opt => {
            let val =
                opt.type === 'integer'
                    ? interaction.options.getInteger(opt.name)
                    : interaction.options.getString(opt.name);
            eventData[opt.name] = val || null;
        });

        // insert into db
        const newEvent = new Event({
            guildId: interaction.guildId,
            createdBy: interaction.user.id,
            type: eventType,
            title: eventData.title,
            description: eventData.description || null,
            date: eventData.date ? new Date(eventData.date) : null,
            difficulty: eventData.difficulty || null,
            location: eventData.location || null,
            gearRequirements: eventData.gear_requirements || null,
            level: eventData.level || null,
            defaultRoles: config.defaultRoles,
            maxPlayers: config.maxPlayers,
            signups: []
        });

        await newEvent.save();

        await interaction.reply({
            content: `✅ Created **${config.name}** event: **${newEvent.title}**\nEvent ID: \`${newEvent._id}\``
        });
    }
}