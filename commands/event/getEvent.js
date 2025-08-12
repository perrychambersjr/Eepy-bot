const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Event = require('../../models/Event')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view-event')
        .setDescription('View an existing event details. Enter an id to view existing event or nothing to view all.')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('Id of event')
                .setRequired(false)
                
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const id = interaction.options.getString('id');

        let events;

        if(id) {
            events = await Event.find({ _id: id, guildId: interaction.guildId });
        } else {
            events = await Event.find({ guildId: interaction.guildId }).sort({ date: 1 });
        }

        if(!events.length && !id) {
            return interaction.editReply('No events found.');
        } else if (!events.length && id) {
            return interaction.editReply(`No event with id: ${id} found.`);
        }
        

        const embed = new EmbedBuilder()
            .setTitle('Upcoming Events')
            .setColor('Blue');

        for (const ev of events) {
            embed.addFields({
                name: ev.title,
                value: `
                    **Date:** ${ev.date ? ev.date.toLocaleString() : 'TBD'}
                    **Type:** ${ev.type}
                    **Description:** ${ev.description || 'No description'}
                `
            });
        }

        return interaction.editReply({ embeds: [embed]})
    }
}