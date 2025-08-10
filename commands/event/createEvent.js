const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRow } = require('discord.js');
const Event = require('../../models/Event');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new-event')
        .setDescription('Create a new World of Warcraft Raid Event.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the raid event')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('date')
                .setDescription('UTC date & time (YYYY-MM-DD HH:mm)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('roles')
                .setDescription('Roles with slots, e.g., Tank:2,Healer:2,DPS:6')
                .setRequired(true)
        ),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const dateInput = interaction.options.getString('date');
        const rolesInput = interaction.options.getString('roles');

        // Parse date
        const dateUTC = new Date(dateInput + ' UTC');
        if (isNaN(dateUTC.getTime())) {
            return interaction.reply({ content: '❌ Invalid date format. Use `YYYY-MM-DD HH:mm` in UTC.', ephemeral: true });
        }

        // Parse roles input
        const roles = rolesInput.split(',').map(r => {
            const [name, slots] = r.split(':');
            return { name: name.trim(), slots: parseInt(slots) };
        });

        // Generate new eventId
        const lastEvent = await Event.findOne().sort({ eventId: -1 });
        const eventId = lastEvent ? lastEvent.eventId + 1 : 1;

        
        // Create DB entry
        const newEvent = new Event({
            eventId,
            guildId: interaction.guildId,
            title,
            dateUTC,
            roles,
            signups: [],
            waitlist: [],
            createdBy: interaction.user.id,
            reminderSent: false
        });

        await newEvent.save();

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle(`Raid Signup: ${title}`)
            .setDescription(`📅 **Date:** <t:${Math.floor(dateUTC.getTime() / 1000)}:F>\n\nClick below to sign up!`)
            .setFooter({ text: `Event ID: ${eventId}` })
            .setColor(0x00AE86);

        //console.log(roles);

        // Build buttons
        // Note: discord button custom Ids can only be a string with no spaces or custom characters, replacing spaces with underscores and
        // making it all lowercase for consistency.
        // Todo: Button interaction to actually sign up as a role.
        const buttons = roles.map(role => (
            new ButtonBuilder()
                .setCustomId(`signup_${eventId}_${role.name.toLowerCase().replace(/\s+/g, '_')}`)
                .setLabel(`${role.name} (${role.slots})`)
                .setStyle(ButtonStyle.Primary)
        ));

        const buttonRow = new ActionRowBuilder().addComponents(...buttons); 

        await interaction.channel.send({
            embeds: [embed],
            components: [buttonRow]
        });

        await interaction.reply(`Raid Event ${title} created!`);
    }
}