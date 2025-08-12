// commands/event/createEvent.js
const { buildCreateEventCommand, createEventFromInteraction } = require('../../services/events/eventService');

module.exports = {
  data: buildCreateEventCommand(),
  async execute(interaction) {
    try {
      const { newEvent, config } = await createEventFromInteraction(interaction);

      await interaction.reply({
        content: `✅ Created **${config.name || newEvent.type}** event: **${newEvent.title}**\nEvent ID: \`${newEvent._id}\``
      });
    } catch (err) {
      console.error('Error creating event:', err);
      
      await interaction.reply({ content: '❌ Failed to create event.', ephemeral: true });
    }
  }
};